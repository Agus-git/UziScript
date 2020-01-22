(ns plugin.utils.conversions)


(defn bytes->uint32 [[n1 n2 n3 n4]]
  (bit-or (bit-shift-left n1 24)
          (bit-shift-left n2 16)
          (bit-shift-left n3 8)
          n4))

(defn uint32->float [uint32]
  (Float/intBitsToFloat (unchecked-int uint32)))

(defn bytes->float [bytes]
  (uint32->float (bytes->uint32 bytes)))

(defn bytes->uint16 [[msb lsb]]
  (bit-or (bit-shift-left msb 8)
          lsb))
