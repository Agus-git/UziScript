(ns middleware.device.protocol)

; Version number
(def MAJOR_VERSION 0)
(def MINOR_VERSION 7)

; Outgoing
(def MSG_OUT_CONNECTION_REQUEST 255)
(def MSG_OUT_SET_PROGRAM 0)
(def MSG_OUT_SET_VALUE 1)
(def MSG_OUT_SET_MODE 2)
(def MSG_OUT_START_REPORTING 3)
(def MSG_OUT_STOP_REPORTING 4)
(def MSG_OUT_SET_REPORT 5)
(def MSG_OUT_SAVE_PROGRAM 6)
(def MSG_OUT_KEEP_ALIVE 7)
(def MSG_OUT_PROFILE 8)
(def MSG_OUT_SET_GLOBAL 10)
(def MSG_OUT_SET_GLOBAL_REPORT 11)
(def MSG_OUT_DEBUG_CONTINUE	12)
(def MSG_OUT_DEBUG_SET_BREAKPOINTS 13)
(def MSG_OUT_DEBUG_SET_BREAKPOINTS_ALL 14)

; Incoming
(def MSG_IN_ERROR 0)
(def MSG_IN_PIN_VALUE 1)
(def MSG_IN_PROFILE 2)
(def MSG_IN_GLOBAL_VALUE 3)
(def MSG_IN_TRACE 4)
(def MSG_IN_COROUTINE_STATE 5)
(def MSG_IN_RUNNING_SCRIPTS 6)
(def MSG_IN_FREE_RAM 7)
(def MSG_IN_SERIAL_TUNNEL 8)

; Error messages
(defn error-msg [code]
  (case code
    0 "NO_ERROR"
    1 "STACK_OVERFLOW"
    2 "STACK_UNDERFLOW"
    3 "STACK_ACCESS_VIOLATION"
    4 "OUT_OF_MEMORY"
    5 "READER_TIMEOUT"
    6 "DISCONNECT_ERROR"
    "UNKNOWN_ERROR"))