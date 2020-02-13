(ns plugin.parser.ast-nodes)
(defn- conj-if-not-nil
  [map key value]
  (conj map
        (when value [key value]))
  )
(defn script-node
  [type & {:keys [identifier arguments tick-rate state locals body]
           :or   {arguments []
                  tick-rate nil
                  state     nil
                  body      nil}}]
  {:__class__   type,
   :name        identifier,
   :arguments   arguments,
   :state       state,
   :tickingRate tick-rate,
   :body        body})

(defn literal-number-node
  [value]
  {:__class__ "UziNumberLiteralNode",
   :value     value})

(defn assignment-node
  [var expr]
  {:__class__ "UziAssignmentNode" :left var :right expr})

(defn variable-declaration-node
  ([name] (variable-declaration-node name nil))
  ([name expr]
   (conj-if-not-nil
     {:__class__ "UziVariableDeclarationNode"
      :name      name}
     :value expr)
   ))

(defn return-node
  [expr]
  {:__class__ "UziReturnNode", :value expr})

(defn for-node
  [name from to by block]
  {:__class__ "UziForNode",
   :counter   (variable-declaration-node name),
   :start     from,
   :stop      to,
   :step      by,
   :body      block})

(defn binary-expression-node
  [left op right]
  {:__class__ "UziCallNode",
   :selector  op,
   :arguments [{:__class__ "Association",
                :key       nil,
                :value     left}
               {:__class__ "Association",
                :key       nil,
                :value     right}]})
