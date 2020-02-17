(ns plugin.compiler.emitter)

(defn program [& {:keys [globals scripts]
                  :or {globals [] scripts []}}]
  {:__class__ "UziProgram"
   :variables globals
   :scripts scripts})

(defn variable
  ([name] (variable name 0))
  ([name value] {:__class__ "UziVariable" :name name :value (or value 0)}))

(defn constant [value]
  {:__class__ "UziVariable" :value value})

(defn script
  [& {:keys [name arguments delay running? locals instructions]
      :or {arguments [] delay 0 running? false locals [] instructions []}}]
  {:__class__ "UziScript"
   :arguments arguments
   :delay (constant delay)
   :instructions instructions
   :locals locals
   :name name
   :ticking running?})

(defn write-global [var-name]
  {:__class__ "UziPopInstruction"
   :argument (variable var-name)})

(defn prim-call [prim-name]
  {:__class__ "UziPrimitiveCallInstruction"
   :argument {:__class__ "UziPrimitive"
              :name prim-name}})

(defn push-value [value]
  {:__class__ "UziPushInstruction"
    :argument (constant value)})

(defn read-global [var-name]
  {:__class__ "UziPushInstruction"
   :argument (variable var-name)})

(defn stop [script-name]
  {:__class__ "UziStopScriptInstruction"
   :argument script-name})

(defn write-local [var-name]
  {:__class__ "UziWriteLocalInstruction"
   :argument (variable var-name)})

(defn read-local [var-name]
  {:__class__ "UziReadLocalInstruction"
   :argument (variable var-name)})

(defn script-call [script-name]
  {:__class__ "UziScriptCallInstruction"
   :argument script-name})
