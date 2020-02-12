(ns plugin.compiler.core
  (:refer-clojure :exclude [compile])
  (:require [cheshire.core :refer [parse-string]]
            [clojure.walk :as w]
            [plugin.device.boards :as boards]
            [plugin.compiler.ast-utils :as ast-utils]
            [plugin.compiler.emitter :as emit]
            [plugin.compiler.primitives :as prims]
            [plugin.compiler.linker :as linker]))

(defmulti compile-node :__class__)

(defn compile [node ctx]
  (compile-node node (update-in ctx [:path] conj node)))

(defn- rate->delay [{:keys [value scale] :as node}]
  (if-not node 0
    (if (= value 0)
      (double Double/MAX_VALUE)
      (/ (case scale
           "s" 1000
           "m" (* 1000 60)
           "h" (* 1000 60 60)
           "d" (* 1000 60 60 24))
         value))))

(defn collect-globals [ast board]
  (let [vars (atom #{})]
    ; Collect all number literals
    (swap! vars into
           (map (fn [{:keys [value]}] (emit/variable :value value))
                (ast-utils/filter ast "UziNumberLiteralNode")))

    ; Collect all pin literals
    (swap! vars into
           (map (fn [{:keys [type number]}] (emit/variable :value (boards/get-pin-number (str type number) board)))
                (ast-utils/filter ast "UziPinLiteralNode")))

    ; Collect all globals
    (swap! vars into
           (map (fn [{:keys [name value]}]
                  (emit/variable :name name :value value))
                (:globals ast)))

    ; Collect all ticking rates
    (swap! vars into
           (map (fn [{:keys [tickingRate]}]
                  (emit/variable :value (rate->delay tickingRate)))
                (:scripts ast)))

    @vars))

(defmethod compile-node "UziProgramNode" [node ctx]
  (emit/program
   :globals (collect-globals node (ctx :board))
   :scripts (->> (node :scripts)
                 (map #(compile % ctx))
                 vec)))

(defmethod compile-node "UziTaskNode"
  [{task-name :name, ticking-rate :tickingRate, state :state, body :body}
   ctx]
  (emit/script
   :name task-name,
   :delay (rate->delay ticking-rate),
   :running? (contains? #{"running" "once"} state)
   :instructions (let [instructions (compile body ctx)]
                   (if (= "once" state)
                     (conj instructions (emit/stop task-name))
                     instructions))))

(defmethod compile-node "UziBlockNode" [node ctx]
  ; TODO(Richo): Add pop instruction if last stmt is expression
  (vec (mapcat #(compile % ctx) (node :statements))))

(defmethod compile-node "UziAssignmentNode" [node ctx]
  (let [right (compile (node :right) ctx)
        var-name (-> node :left :name)]
    (conj right (emit/pop var-name))))

(defmethod compile-node "UziCallNode" [node ctx]
  ; TODO(Richo): Detect primitive calls correctly!
  (conj (vec (mapcat #(compile (:value %) ctx)
                     (node :arguments)))
        (emit/prim (node :primitive-name))))

(defmethod compile-node "UziNumberLiteralNode" [node _]
  [(emit/push-value (node :value))])

(defmethod compile-node "UziVariableNode" [node _]
  ; TODO(Richo): Detect if var is global or local
  [(emit/push-var (node :name))])

(defmethod compile-node "UziVariableDeclarationNode"
  [{:keys [unique-name value]} ctx]
  ; TODO(Richo): Check if the variable value is a literal number
  (conj (compile value ctx)
        (emit/write-local unique-name)))

(defmethod compile-node "UziPinLiteralNode" [{:keys [type number]} ctx]
  [(emit/push-value (boards/get-pin-number (str type number) (ctx :board)))])

(defmethod compile-node :default [node _]
  (println "ERROR! Unknown node: " (:__class__ node))
  :oops)

(defn- create-context [board]
  {:path (list)
   :board board})

(defn- assign-unique-variable-names [ast]
  ; TODO(Richo): Only apply to locals?
  (let [counter (atom 0)]
    (w/postwalk
     #(if (= "UziVariableDeclarationNode" (get % :__class__ ))
        (assoc % :unique-name (str (:name %) "#" (swap! counter inc)))
        %)
     ast)))

(defn compile-tree
  ([ast] (compile-tree ast boards/UNO))
  ([ast board]
   (-> ast
       linker/bind-primitives
       assign-unique-variable-names
       (compile (create-context board)))))

(defn compile-json-string [str]
  (compile-tree (parse-string str true)))
