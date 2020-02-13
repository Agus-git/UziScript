(ns plugin.parser.core
  (:require [instaparse.core :as insta])
  (:require [plugin.parser.ast-nodes :refer :all]))


(defn- first-or-default [pred col default]
  (or (first (filter pred col)) default))
(defn- first-class-or-default [name col default] (first-or-default #(= (:__class__ %) name) col default))
(defn- filter-class [name col] (filterv #(= (:__class__ %) name) col))

(def operator-precedence ["**"
                          "*"
                          "/"
                          "%"
                          "+"
                          "-"
                          "<<"
                          ">>"
                          "<"
                          "<="
                          ">"
                          ">="
                          "=="
                          "!="
                          "&"
                          "^"
                          "|"
                          "&&"
                          "||"])
(def operator-grammar (str "\nbinaryExpr = ws ( " (String/join " / " (reverse (map #(str " ws expr ws '" % "' ws expr ws ") operator-precedence))) ") ws\n"))




(def scriptTypes #{"UziTaskNode" "UziProcedureNode" "UziFunctionNode"})
(def transformations
  {:integer             (comp clojure.edn/read-string str)
   :float               (comp #(Float/parseFloat %) str)
   :program             (fn [& arg]
                          (program-node
                            []
                            (filter-class "UziVariableDeclarationNode" arg)
                            (filterv #(contains? scriptTypes (:__class__ %)) arg)
                            [])),
   :task                (fn [identifier params state & rest]
                          (script-node "UziTaskNode"
                                       :identifier identifier
                                       :arguments params
                                       :state (or (second state) "once")
                                       :tick-rate (first-class-or-default "UziTickingRateNode" rest nil)
                                       :body (first-class-or-default "UziBlockNode" rest nil)))
   :procedure           (fn [identifier params & rest]
                          (script-node "UziProcedureNode"
                                       :identifier identifier
                                       :arguments params
                                       :body (first-class-or-default "UziBlockNode" rest nil)))
   :function            (fn [identifier params & rest]
                          (script-node "UziFunctionNode"
                                       :identifier identifier
                                       :arguments params
                                       :body (first-class-or-default "UziBlockNode" rest nil)))

   :tickingRate         (fn [times unit] (ticking-rate-node (:value times) unit)),
   :namedArg            (fn [a & b] (association-node (if b a nil) (or b a)))
   :constant            literal-pin-node
   :number              (fn [number] (literal-number-node number))
   :call                call-node
   :block               (fn [& statements] (block-node (vec statements)))
   :paramsList          (fn [& params] (or (vec params) []))
   :argument            variable-declaration-node
   :variableDeclaration (fn [variable & expr]
                          (variable-declaration-node (:name variable) (first expr)))
   :variable            variable-node
   :return              (fn [& expr] (return-node (or (first expr) (literal-number-node 0))))
   :subExpr             (fn [rest] rest)
   :for                 (fn
                          ([var from to block] (for-node (:name var) from to (literal-number-node 1) block))
                          ([var from to by block] (for-node (:name var) from to by block)))
   :while               (fn [expr & block] (while-node (block-node []) expr (or (first block) (block-node [])) false))
   :until               (fn [expr & block] (while-node (block-node []) expr (or (first block) (block-node [])) true))
   :doWhile             (fn [block expr] (while-node block expr (block-node []) false))
   :doUntil             (fn [block expr] (while-node block expr (block-node []) true))
   :forever             forever-node
   :repeat              repeat-node
   :conditional         (fn
                          ([expr block] (conditional-node expr block (block-node [])))
                          ([expr block else-block] (conditional-node expr block else-block)))
   :assignment          assignment-node
   :binaryExpr          binary-expression-node
   })

(def parse-program
  (insta/parser
    (str "program = ws import* ws variableDeclaration* ws (primitive / script) * ws
         import = ws <'import'> ws (identifier ws <'from'> ws)? importPath ws (endl / block)
         importPath = #'\\'[^\\']+\\''
         <script> =  (task / function / procedure)
         block = ws <'{'> ws statementList ws <'}'> ws

         primitive = ws <'prim'> ws ((binarySelector / identifier) ws <':'> ws)? identifier endl

         <statementList> = ws statement*
         <statement> = ws (variableDeclaration | assignment | return | conditional
                      | startTask | stopTask | pauseTask | resumeTask
                      |while|doWhile|until|doUntil|repeat|forever|for|yield|expressionStatement) ws

         variableDeclaration = <'var'> ws variable (ws <'='> ws expr)?  endl
         assignment = ws variable ws <'='> ws expr  endl
         return =  ws <'return'> ws expr? endl
         conditional = ws <'if'> ws expr ws block (ws <'else'> ws block ws)?
         while = ws <'while'> ws expr ws ( block ws / endl )
         doWhile = ws <'do'> ws block ws <'while'> ws expr endl
         until = ws <'until'> ws expr ws (block ws / endl )
         doUntil = ws <'do'> ws block ws <'until'> ws expr endl
         repeat = ws <'repeat'> ws expr ws block ws
         forever = ws <'forever'> ws block ws
         for = ws <'for'> ws variable ws <'='> ws expr ws <'to'> expr ws (<'by'> ws expr ws)? block ws
         yield = ws <'yield'> endl
         <expressionStatement> = expr endl

         startTask = ws <'start'> ws scriptList endl
         stopTask = ws <'stop'> ws scriptList endl
         pauseTask = ws <'pause'> ws scriptList endl
         resumeTask = ws <'resume'> ws scriptList endl



         scriptList = ws scriptReference (ws <','> ws scriptReference)* endl
         <scriptReference> = ws identifier ws

         <identifier> = name ('.' name)*
         variable = ws identifier ws

         task=<'task'> ws identifier paramsList taskState tickingRate? block ws

         paramsList = ws<'('> (ws argument (ws <','> ws argument)*)? ws <')'> ws
         argument = ws identifier ws
         taskState = ws ('running'|'stopped')? ws
         tickingRate = number ws <'/'> ( 's' | 'm' | 'h' | 'd')

         function = ws <'func'> ws identifier ws paramsList ws block ws
         procedure = ws <'proc'> ws identifier ws paramsList ws block ws

         comments = (<'\"'> #'[^\"]*' <'\"'>)






         <expr> =(binaryExpr / nonBinaryExpr)
         <nonBinaryExpr> = (unary / literal / call / variable / subExpr)
         <unary> = not
         not = ws <'!'> ws nonBinaryExpr ws
         <literal> = (constant / number)
         constant = ws ('D'/'A') integer ws
         call = ws scriptReference argList ws
         <argList> = ws <'('> ws (namedArg (ws <','> ws namedArg)*)?<')'>
         namedArg = ws( identifier ws <':'> ws)? expr ws
         subExpr = ws <'('> ws expr ws <')'> ws

         binarySelector = #'[^a-zA-Z0-9\\s\\[\\]\\(\\)\\{\\}\\\"\\':#_;,]'

         <endl> =ws <';'> ws
         <name> =#'[a-zA-Z_][_\\w]*'
         <ws> = (<#'\\s'*> / comments)+
         <letter> = #'[a-zA-Z]'
         <word> = #'\\w'
         <digits> = #'\\d+'
         integer = '-'? digits
         float = ('NaN' /#'-?Infinity' / integer '.' digits)
         number = (float / integer)" operator-grammar)))

(defn parse [str] (insta/transform transformations (parse-program str)))

