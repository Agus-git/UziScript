(ns middleware.compiler.checker
  (:require [middleware.compiler.ast-utils :as ast-utils]))

(defn- register-error! [description node errors]
  (swap! errors conj {:node node
                      :description description}))

(defn- assert [bool description node errors]
  (when (not bool)
    (register-error! description node errors))
  bool)

(defn assert-statement [node errors]
  (assert (ast-utils/statement? node)
          "Statement expected"
          node errors))

(defmulti check-node (fn [node errors path] (:__class__ node)))

(defn- check [node errors path]
  (check-node node errors (conj path node))
  (doseq [child-node (ast-utils/children node)]
    (check child-node errors path)))

(defmethod check-node "UziProgramNode" [node errors path]
  (let [imports (:imports node)]
    (doseq [import imports]
      ; TODO(Richo): ?
      )))

(defmethod check-node "UziTaskNode" [node errors path]
  )

(defmethod check-node "UziCallNode" [node errors path])

(defmethod check-node "UziBlockNode" [node errors path]
  (doseq [stmt (:statements node)]
    (assert-statement stmt errors)))


(defmethod check-node "UziNumberLiteralNode" [node errors path]
  (assert (number? (:value node))
          "Number expected"
          node
          errors))

(defmethod check-node "UziPinLiteralNode" [node errors path]
  (assert (contains? #{"D" "A"} (:type node))
          "Invalid pin type"
          node
          errors)
  (assert (pos-int? (:number node))
          "Positive integer expected"
          node
          errors))

(defmethod check-node "Association" [_ _ _]) ; TODO(Richo): Remove

(defmethod check-node :default [node _ _]
  (throw (ex-info "MISSING: " node)))

(defn check-tree [ast]
  (let [errors (atom [])
        path (list)]
    (check ast errors path)
    @errors))

#_(
   (do ; Definitions
     (def parse middleware.parser.parser/parse)
     (def pprint clojure.pprint/pprint)
     (def ast (parse "task foo() stopped {F4;}")))
  (pprint ast)
  (check-tree ast)

  )
