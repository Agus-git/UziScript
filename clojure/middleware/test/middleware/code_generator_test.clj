(ns middleware.code-generator-test
  (:require [clojure.test :refer :all]
            [middleware.code_generator.code_generator :refer :all ])
  (:use [middleware.test-utils]))


(deftest sanity-check
  (testing "Sanity check."
    (is (= 1 1))))

(deftest empty-program
  (testing "An Empty program should return an empty string"
    (let [expected ""
          ast {:__class__ "UziProgramNode",
               :imports [],
               :globals [],
               :scripts [],
               :primitives []}
          actual (print ast)]
      (is (= expected actual)))))

(deftest uninitialized-global-declaration
  (testing "An uninitialized Global variable should be printed on top of the program with it's default value"
    (let [expected "var a = 0;"
          ast {:__class__ "UziProgramNode",
               :imports [],
               :globals [{:__class__ "UziVariableDeclarationNode",
                          :name "a", :value {:__class__ "UziNumberLiteralNode", :value 0}}],
               :scripts [],
               :primitives []}
          actual (print ast)]
      (is (= expected actual)))))

(deftest multiple-global-declaration
  (testing "Several global variables declared should be printed in the correct order and the defined value"
    (let [expected "var a = 5;\nvar b = 3;\nvar c = 0.5;\nvar d = D13;"
          ast {:__class__ "UziProgramNode",
               :imports [],
               :globals [{:__class__ "UziVariableDeclarationNode", :name "a", :value {:__class__ "UziNumberLiteralNode", :value 5}}
                         {:__class__ "UziVariableDeclarationNode", :name "b", :value {:__class__ "UziNumberLiteralNode", :value 3}}
                         {:__class__ "UziVariableDeclarationNode", :name "c", :value {:__class__ "UziNumberLiteralNode", :value 0.5}}
                         {:__class__ "UziVariableDeclarationNode", :name "d",:value {:__class__ "UziPinLiteralNode", :type "D", :number 13}}],
               :scripts [],
               :primitives []}
          actual (print ast)]
      (is (= expected actual)))))

(deftest empty-script-running-once
  (testing "An empty script without any statements nor tickrate"
    (let [expected "task foo() {\n}"
          ast {:__class__ "UziProgramNode",
               :imports [],
               :globals [],
               :scripts [{:__class__ "UziTaskNode",
                          :name "foo",
                          :arguments [],
                          :body {:__class__ "UziBlockNode", :statements []},
                          :state "once",
                          :tickingRate nil}],
               :primitives []}
          actual (print ast)]
      (is (= expected actual)))))

(deftest empty-script-stopped
  (testing "An empty and stopped script without any statements "
    (let [expected "task bar() stopped {\n}"
          ast {:__class__ "UziProgramNode",
               :imports [],
               :globals [],
               :scripts [{:__class__ "UziTaskNode",
                          :name "bar",
                          :arguments [],
                          :body {:__class__ "UziBlockNode", :statements []},
                          :state "stopped",
                          :tickingRate nil}],
               :primitives []}
          actual (print ast)]
      (is (= expected actual)))))

(deftest empty-script-ticking
  (testing "An empty ticking script without any statements "
    (let [expected "task baz() running 3/s {\n}"
          ast {:__class__ "UziProgramNode",
               :imports [],
               :globals [],
               :scripts [{:__class__ "UziTaskNode",
                          :name "baz",
                          :arguments [],
                          :body {:__class__ "UziBlockNode", :statements []},
                          :state "running",
                          :tickingRate {:__class__ "UziTickingRateNode", :value 3, :scale "s"}}],
               :primitives []}
          actual (print ast)]
      (is (= expected actual)))))

(deftest blink13
  (testing "The classic blink example"
    (let [expected "task blink() running 1/s {\n\ttoggle(D13);\n}"
          ast {:__class__ "UziProgramNode",
               :imports [],
               :globals [],
               :scripts [{:__class__ "UziTaskNode",
                          :name "blink",
                          :arguments [],
                          :body {:__class__ "UziBlockNode",
                                 :statements [{:__class__ "UziCallNode",
                                               :selector "toggle",
                                               :arguments [{:__class__ "Association",
                                                            :key nil,
                                                            :value {:__class__ "UziPinLiteralNode", :type "D", :number 13}}]}]},
                          :state "running",
                          :tickingRate {:__class__ "UziTickingRateNode", :value 1, :scale "s"}}],
               :primitives []}
          actual (print ast)]
      (is (= expected actual)))))

(deftest procedure-with-argument
  (testing "A procedure with a single argument"
    (let [expected "proc blink(arg0) {\n\tturnOn(arg0);\n\tdelayS(1);\n\tturnOff(arg0);\n}"
          ast {:__class__ "UziProgramNode",
               :imports [],
               :globals [],
               :scripts [{:__class__ "UziProcedureNode",
                          :name "blink",
                          :arguments [{:__class__ "UziVariableDeclarationNode",
                                       :name "arg0",
                                       :value {:__class__ "UziNumberLiteralNode", :value 0}}],
                          :body {:__class__ "UziBlockNode",
                                 :statements [{:__class__ "UziCallNode",
                                               :selector "turnOn",
                                               :arguments [{:__class__ "Association",
                                                            :key nil,
                                                            :value {:__class__ "UziVariableNode", :name "arg0"}}]}
                                              {:__class__ "UziCallNode",
                                               :selector "delayS",
                                               :arguments [{:__class__ "Association",
                                                            :key nil,
                                                            :value {:__class__ "UziNumberLiteralNode", :value 1}}]}
                                              {:__class__ "UziCallNode",
                                               :selector "turnOff",
                                               :arguments [{:__class__ "Association",
                                                            :key nil,
                                                            :value {:__class__ "UziVariableNode", :name "arg0"}}]}]}}],
               :primitives []}
          actual (print ast)]
      (is (= expected actual)))))

(deftest function-with-arguments
  (testing "A Function with two arguments and a return"
    (let [expected "func default(arg0, arg1) {\n\treturn (arg0 % arg1);\n}"
          ast {:__class__ "UziProgramNode",
               :imports [],
               :globals [],
               :scripts [{:__class__ "UziFunctionNode",
                          :name "default",
                          :arguments [{:__class__ "UziVariableDeclarationNode",
                                       :name "arg0",
                                       :value {:__class__ "UziNumberLiteralNode", :value 0}}
                                      {:__class__ "UziVariableDeclarationNode",
                                       :name "arg1",
                                       :value {:__class__ "UziNumberLiteralNode", :value 0}}],
                          :body {:__class__ "UziBlockNode",
                                 :statements [{:__class__ "UziReturnNode",
                                               :value {:__class__ "UziCallNode",
                                                       :selector "%",
                                                       :arguments [{:__class__ "Association",
                                                                    :key nil,
                                                                    :value {:__class__ "UziVariableNode", :name "arg0"}}
                                                                   {:__class__ "Association",
                                                                    :key nil,
                                                                    :value {:__class__ "UziVariableNode", :name "arg1"}}]}}]}}],
               :primitives []}
          actual (print ast)]
      (is (= expected actual)))))

(deftest functions-with-calls-and-globals
  (testing "A program with two functions that modify a global"
    (let [expected "var global = 0;\nfunc forIncrease(from, to, by) {\n\tfor i = from to to by by {\n\t\tglobal = (global + 1);\n\t}\n\treturn global;\n}\nfunc run() {\n\tvar temp = forIncrease(1, 10, 0.5);\n}"
          ast {:__class__ "UziProgramNode",
               :imports [],
               :globals [{:__class__ "UziVariableDeclarationNode",
                          :name "global",
                          :value {:__class__ "UziNumberLiteralNode", :value 0}}],
               :scripts [{:__class__ "UziFunctionNode",
                          :name "forIncrease",
                          :arguments [{:__class__ "UziVariableDeclarationNode",
                                       :name "from",
                                       :value {:__class__ "UziNumberLiteralNode", :value 0}}
                                      {:__class__ "UziVariableDeclarationNode",
                                       :name "to",
                                       :value {:__class__ "UziNumberLiteralNode", :value 0}}
                                      {:__class__ "UziVariableDeclarationNode",
                                       :name "by",
                                       :value {:__class__ "UziNumberLiteralNode", :value 0}}],
                          :body {:__class__ "UziBlockNode",
                                 :statements [{:__class__ "UziForNode",
                                               :counter {:__class__ "UziVariableDeclarationNode",
                                                         :name "i",
                                                         :value {:__class__ "UziNumberLiteralNode", :value 0}},
                                               :start {:__class__ "UziVariableNode", :name "from"},
                                               :stop {:__class__ "UziVariableNode", :name "to"},
                                               :step {:__class__ "UziVariableNode", :name "by"},
                                               :body {:__class__ "UziBlockNode",
                                                      :statements [{:__class__ "UziAssignmentNode",
                                                                    :left {:__class__ "UziVariableNode", :name "global"},
                                                                    :right {:__class__ "UziCallNode",
                                                                            :selector "+",
                                                                            :arguments [{:__class__ "Association",
                                                                                         :key nil,
                                                                                         :value {:__class__ "UziVariableNode",
                                                                                                 :name "global"}}
                                                                                        {:__class__ "Association",
                                                                                         :key nil,
                                                                                         :value {:__class__ "UziNumberLiteralNode",
                                                                                                 :value 1}}]}}]}}
                                              {:__class__ "UziReturnNode", :value {:__class__ "UziVariableNode", :name "global"}}]}}
                         {:__class__ "UziFunctionNode",
                          :name "run",
                          :arguments [],
                          :body {:__class__ "UziBlockNode",
                                 :statements [{:__class__ "UziVariableDeclarationNode",
                                               :name "temp",
                                               :value {:__class__ "UziCallNode",
                                                       :selector "forIncrease",
                                                       :arguments [{:__class__ "Association",
                                                                    :key nil,
                                                                    :value {:__class__ "UziNumberLiteralNode", :value 1}}
                                                                   {:__class__ "Association",
                                                                    :key nil,
                                                                    :value {:__class__ "UziNumberLiteralNode", :value 10}}
                                                                   {:__class__ "Association",
                                                                    :key nil,
                                                                    :value {:__class__ "UziNumberLiteralNode", :value 0.5}}]}}]}}],
               :primitives []}
          actual (print ast)]
      (is (= expected actual)))))


(deftest control-structures
  (testing "Several tasks with the main control structures on them"
    (let [expected "task while_loop() {\n\twhile 1 {\n\t\twhile 1;\n\t}\n}\ntask until_loop() {\n\tuntil 1 {\n\t\tuntil 1;\n\t}\n}\ntask repeat_forever() {\n\tforever {\n\t\trepeat 5 {\n\t\t}\n\t}\n}\ntask conditional() {\n\tif 1 {\n\t\tif 0 {\n\t\t\tdelayS(1000);\n\t\t}\n\t} else {\n\t\tdelayMs(1000);\n\t}\n}"
          ast {:__class__ "UziProgramNode",
               :imports [],
               :globals [],
               :scripts [{:__class__ "UziTaskNode",
                          :name "while_loop",
                          :arguments [],
                          :body {:__class__ "UziBlockNode",
                                 :statements [{:__class__ "UziWhileNode",
                                               :pre {:__class__ "UziBlockNode", :statements []},
                                               :condition {:__class__ "UziNumberLiteralNode", :value 1},
                                               :post {:__class__ "UziBlockNode",
                                                      :statements [{:__class__ "UziWhileNode",
                                                                    :pre {:__class__ "UziBlockNode", :statements []},
                                                                    :condition {:__class__ "UziNumberLiteralNode", :value 1},
                                                                    :post {:__class__ "UziBlockNode", :statements []},
                                                                    :negated false}]},
                                               :negated false}]},
                          :state "once",
                          :tickingRate nil}
                         {:__class__ "UziTaskNode",
                          :name "until_loop",
                          :arguments [],
                          :body {:__class__ "UziBlockNode",
                                 :statements [{:__class__ "UziUntilNode",
                                               :pre {:__class__ "UziBlockNode", :statements []},
                                               :condition {:__class__ "UziNumberLiteralNode", :value 1},
                                               :post {:__class__ "UziBlockNode",
                                                      :statements [{:__class__ "UziUntilNode",
                                                                    :pre {:__class__ "UziBlockNode", :statements []},
                                                                    :condition {:__class__ "UziNumberLiteralNode", :value 1},
                                                                    :post {:__class__ "UziBlockNode", :statements []},
                                                                    :negated true}]},
                                               :negated true}]},
                          :state "once",
                          :tickingRate nil}
                         {:__class__ "UziTaskNode",
                          :name "repeat_forever",
                          :arguments [],
                          :body {:__class__ "UziBlockNode",
                                 :statements [{:__class__ "UziForeverNode",
                                               :body {:__class__ "UziBlockNode",
                                                      :statements [{:__class__ "UziRepeatNode",
                                                                    :times {:__class__ "UziNumberLiteralNode", :value 5},
                                                                    :body {:__class__ "UziBlockNode", :statements []}}]}}]},
                          :state "once",
                          :tickingRate nil}
                         {:__class__ "UziTaskNode",
                          :name "conditional",
                          :arguments [],
                          :body {:__class__ "UziBlockNode",
                                 :statements [{:__class__ "UziConditionalNode",
                                               :condition {:__class__ "UziNumberLiteralNode", :value 1},
                                               :trueBranch {:__class__ "UziBlockNode",
                                                            :statements [{:__class__ "UziConditionalNode",
                                                                          :condition {:__class__ "UziNumberLiteralNode", :value 0},
                                                                          :trueBranch {:__class__ "UziBlockNode",
                                                                                       :statements [{:__class__ "UziCallNode",
                                                                                                     :selector "delayS",
                                                                                                     :arguments [{:__class__ "Association",
                                                                                                                  :key nil,
                                                                                                                  :value {:__class__ "UziNumberLiteralNode",
                                                                                                                          :value 1000}}]}]},
                                                                          :falseBranch {:__class__ "UziBlockNode", :statements []}}]},
                                               :falseBranch {:__class__ "UziBlockNode",
                                                             :statements [{:__class__ "UziCallNode",
                                                                           :selector "delayMs",
                                                                           :arguments [{:__class__ "Association",
                                                                                        :key nil,
                                                                                        :value {:__class__ "UziNumberLiteralNode",
                                                                                                :value 1000}}]}]}}]},
                          :state "once",
                          :tickingRate nil}],
               :primitives []}
          actual (print ast)]
      (is (= expected actual)))))

(deftest control-structures-part-II
  (testing "A task with a do while, do until and a yield"
    (let [expected "task test() {\n\tdo {\n\t\tvar a = 3;\n\t} until(1);\n\tdo {\n\t\tvar a = 4;\n\t\tyield;\n\t} while(1);\n}"
          ast {:__class__ "UziProgramNode",
               :imports [],
               :globals [],
               :scripts [{:__class__ "UziTaskNode",
                          :name "test",
                          :arguments [],
                          :body {:__class__ "UziBlockNode",
                                 :statements [{:__class__ "UziDoUntilNode",
                                               :pre {:__class__ "UziBlockNode",
                                                     :statements [{:__class__ "UziVariableDeclarationNode",
                                                                   :name "a",
                                                                   :value {:__class__ "UziNumberLiteralNode", :value 3}}]},
                                               :condition {:__class__ "UziNumberLiteralNode", :value 1},
                                               :post {:__class__ "UziBlockNode", :statements []},
                                               :negated true}
                                              {:__class__ "UziDoWhileNode",
                                               :pre {:__class__ "UziBlockNode",
                                                     :statements [{:__class__ "UziVariableDeclarationNode",
                                                                   :name "a",
                                                                   :value {:__class__ "UziNumberLiteralNode", :value 4}}
                                                                  {:__class__ "UziYieldNode"}]},
                                               :condition {:__class__ "UziNumberLiteralNode", :value 1},
                                               :post {:__class__ "UziBlockNode", :statements []},
                                               :negated false}]},
                          :state "once",
                          :tickingRate nil}],
               :primitives []}
          actual (print ast)]
      (is (= expected actual)))))

(deftest motor-usage
  (testing "Two tasks that operate a servo and a DC. This has some imports"
    (let [expected "import motor from 'DCMotor.uzi' {\n\tenablePin = D10;\n\tforwardPin = D9;\n\treversePin = D8;\n}\ntask servo() {\n\tforever {\n\t\tsetServoDegrees(D3, 90);\n\t\tdelayMs(1000);\n\t\tsetServoDegrees(D3, 0);\n\t\tdelayMs(1000);\n\t}\n}\ntask default1() running 20/m {\n\tmotor.forward(speed: 1);\n\tdelayMs(1000);\n\tmotor.brake();\n\tdelayMs(1000);\n}"
          ast {:__class__ "UziProgramNode",
               :imports [{:__class__ "UziImportNode",
                          :alias "motor",
                          :path "DCMotor.uzi",
                          :initializationBlock {:__class__ "UziBlockNode",
                                                :statements [{:__class__ "UziAssignmentNode",
                                                              :left {:__class__ "UziVariableNode", :name "enablePin"},
                                                              :right {:__class__ "UziPinLiteralNode", :type "D", :number 10}}
                                                             {:__class__ "UziAssignmentNode",
                                                              :left {:__class__ "UziVariableNode", :name "forwardPin"},
                                                              :right {:__class__ "UziPinLiteralNode", :type "D", :number 9}}
                                                             {:__class__ "UziAssignmentNode",
                                                              :left {:__class__ "UziVariableNode", :name "reversePin"},
                                                              :right {:__class__ "UziPinLiteralNode", :type "D", :number 8}}]}}],
               :globals [],
               :scripts [{:__class__ "UziTaskNode",
                          :name "servo",
                          :arguments [],
                          :body {:__class__ "UziBlockNode",
                                 :statements [{:__class__ "UziForeverNode",
                                               :body {:__class__ "UziBlockNode",
                                                      :statements [{:__class__ "UziCallNode",
                                                                    :selector "setServoDegrees",
                                                                    :arguments [{:__class__ "Association",
                                                                                 :key nil,
                                                                                 :value {:__class__ "UziPinLiteralNode",
                                                                                         :type "D",
                                                                                         :number 3}}
                                                                                {:__class__ "Association",
                                                                                 :key nil,
                                                                                 :value {:__class__ "UziNumberLiteralNode", :value 90}}]}
                                                                   {:__class__ "UziCallNode",
                                                                    :selector "delayMs",
                                                                    :arguments [{:__class__ "Association",
                                                                                 :key nil,
                                                                                 :value {:__class__ "UziNumberLiteralNode",
                                                                                         :value 1000}}]}
                                                                   {:__class__ "UziCallNode",
                                                                    :selector "setServoDegrees",
                                                                    :arguments [{:__class__ "Association",
                                                                                 :key nil,
                                                                                 :value {:__class__ "UziPinLiteralNode",
                                                                                         :type "D",
                                                                                         :number 3}}
                                                                                {:__class__ "Association",
                                                                                 :key nil,
                                                                                 :value {:__class__ "UziNumberLiteralNode", :value 0}}]}
                                                                   {:__class__ "UziCallNode",
                                                                    :selector "delayMs",
                                                                    :arguments [{:__class__ "Association",
                                                                                 :key nil,
                                                                                 :value {:__class__ "UziNumberLiteralNode",
                                                                                         :value 1000}}]}]}}]},
                          :state "once",
                          :tickingRate nil}
                         {:__class__ "UziTaskNode",
                          :name "default1",
                          :arguments [],
                          :body {:__class__ "UziBlockNode",
                                 :statements [{:__class__ "UziCallNode",
                                               :selector "motor.forward",
                                               :arguments [{:__class__ "Association",
                                                            :key "speed",
                                                            :value {:__class__ "UziNumberLiteralNode", :value 1}}]}
                                              {:__class__ "UziCallNode",
                                               :selector "delayMs",
                                               :arguments [{:__class__ "Association",
                                                            :key nil,
                                                            :value {:__class__ "UziNumberLiteralNode", :value 1000}}]}
                                              {:__class__ "UziCallNode", :selector "motor.brake", :arguments []}
                                              {:__class__ "UziCallNode",
                                               :selector "delayMs",
                                               :arguments [{:__class__ "Association",
                                                            :key nil,
                                                            :value {:__class__ "UziNumberLiteralNode", :value 1000}}]}]},
                          :state "running",
                          :tickingRate {:__class__ "UziTickingRateNode", :value 20, :scale "m"}}],
               :primitives []}
          actual (print ast)]
      (is (= expected actual)))))


(deftest sonar-and-button
  (testing "Two tasks where one handles a button to start and stop the sonar one"
    (let [expected "import sonar from 'Sonar.uzi' {\n\ttrigPin = D11;\n\techoPin = D12;\n\tmaxDistance = 200;\n\tstart reading;\n}\nimport buttons from 'Buttons.uzi' {\n\tdebounceMs = 50;\n}\nvar variable1 = 0;\ntask sonar() stopped 1/h {\n\twrite(D13, sonar.distance_cm());\n}\ntask button() running 1/s {\n\tif variable1 {\n\t\tbuttons.waitForRelease(D7);\n\t\tvariable1 = (!variable1);\n\t\tstart sonar;\n\t} else {\n\t\tstop sonar;\n\t}\n}"
          ast {:__class__ "UziProgramNode",
               :imports [{:__class__ "UziImportNode",
                          :alias "sonar",
                          :path "Sonar.uzi",
                          :initializationBlock {:__class__ "UziBlockNode",
                                                :statements [{:__class__ "UziAssignmentNode",
                                                              :left {:__class__ "UziVariableNode", :name "trigPin"},
                                                              :right {:__class__ "UziPinLiteralNode", :type "D", :number 11}}
                                                             {:__class__ "UziAssignmentNode",
                                                              :left {:__class__ "UziVariableNode", :name "echoPin"},
                                                              :right {:__class__ "UziPinLiteralNode", :type "D", :number 12}}
                                                             {:__class__ "UziAssignmentNode",
                                                              :left {:__class__ "UziVariableNode", :name "maxDistance"},
                                                              :right {:__class__ "UziNumberLiteralNode", :value 200}}
                                                             {:__class__ "UziScriptStartNode", :scripts ["reading"]}]}}
                         {:__class__ "UziImportNode",
                          :alias "buttons",
                          :path "Buttons.uzi",
                          :initializationBlock {:__class__ "UziBlockNode",
                                                :statements [{:__class__ "UziAssignmentNode",
                                                              :left {:__class__ "UziVariableNode", :name "debounceMs"},
                                                              :right {:__class__ "UziNumberLiteralNode", :value 50}}]}}],
               :globals [{:__class__ "UziVariableDeclarationNode",
                          :name "variable1",
                          :value {:__class__ "UziNumberLiteralNode", :value 0}}],
               :scripts [{:__class__ "UziTaskNode",
                          :name "sonar",
                          :arguments [],
                          :body {:__class__ "UziBlockNode",
                                 :statements [{:__class__ "UziCallNode",
                                               :selector "write",
                                               :arguments [{:__class__ "Association",
                                                            :key nil,
                                                            :value {:__class__ "UziPinLiteralNode", :type "D", :number 13}}
                                                           {:__class__ "Association",
                                                            :key nil,
                                                            :value {:__class__ "UziCallNode",
                                                                    :selector "sonar.distance_cm",
                                                                    :arguments []}}]}]},
                          :state "stopped",
                          :tickingRate {:__class__ "UziTickingRateNode", :value 1, :scale "h"}}
                         {:__class__ "UziTaskNode",
                          :name "button",
                          :arguments [],
                          :body {:__class__ "UziBlockNode",
                                 :statements [{:__class__ "UziConditionalNode",
                                               :condition {:__class__ "UziVariableNode", :name "variable1"},
                                               :trueBranch {:__class__ "UziBlockNode",
                                                            :statements [{:__class__ "UziCallNode",
                                                                          :selector "buttons.waitForRelease",
                                                                          :arguments [{:__class__ "Association",
                                                                                       :key nil,
                                                                                       :value {:__class__ "UziPinLiteralNode",
                                                                                               :type "D",
                                                                                               :number 7}}]}
                                                                         {:__class__ "UziAssignmentNode",
                                                                          :left {:__class__ "UziVariableNode", :name "variable1"},
                                                                          :right {:__class__ "UziCallNode",
                                                                                  :selector "!",
                                                                                  :arguments [{:__class__ "Association",
                                                                                               :key nil,
                                                                                               :value {:__class__ "UziVariableNode",
                                                                                                       :name "variable1"}}]}}
                                                                         {:__class__ "UziScriptStartNode", :scripts ["sonar"]}]},
                                               :falseBranch {:__class__ "UziBlockNode",
                                                             :statements [{:__class__ "UziScriptStopNode", :scripts ["sonar"]}]}}]},
                          :state "running",
                          :tickingRate {:__class__ "UziTickingRateNode", :value 1, :scale "s"}}],
               :primitives []}
          actual (print ast)]
      (is (= expected actual)))))

(deftest primitive-definition
  (testing "Creating a few primitives"
    (let [expected "prim add;\nprim ~= : notEquals;\ntask test() {\n\tvar a = add(3, 4);\n\tvar b = (3 ~= 4);\n}"
          ast {:__class__ "UziProgramNode",
               :imports [],
               :globals [],
               :scripts [{:__class__ "UziTaskNode",
                          :name "test",
                          :arguments [],
                          :body {:__class__ "UziBlockNode",
                                 :statements [{:__class__ "UziVariableDeclarationNode",
                                               :name "a",
                                               :value {:__class__ "UziCallNode",
                                                       :selector "add",
                                                       :arguments [{:__class__ "Association",
                                                                    :key nil,
                                                                    :value {:__class__ "UziNumberLiteralNode", :value 3}}
                                                                   {:__class__ "Association",
                                                                    :key nil,
                                                                    :value {:__class__ "UziNumberLiteralNode", :value 4}}]}}
                                              {:__class__ "UziVariableDeclarationNode",
                                               :name "b",
                                               :value {:__class__ "UziCallNode",
                                                       :selector "~=",
                                                       :arguments [{:__class__ "Association",
                                                                    :key nil,
                                                                    :value {:__class__ "UziNumberLiteralNode", :value 3}}
                                                                   {:__class__ "Association",
                                                                    :key nil,
                                                                    :value {:__class__ "UziNumberLiteralNode", :value 4}}]}}]},
                          :state "once",
                          :tickingRate nil}],
               :primitives [{:__class__ "UziPrimitiveDeclarationNode", :alias "add", :name "add"}
                            {:__class__ "UziPrimitiveDeclarationNode", :alias "~=", :name "notEquals"}]}

          actual (print ast)]
      (is (= expected actual)))))