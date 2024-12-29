;; Time Capsule Storage Contract

(define-fungible-token storage-token)

(define-constant storage-rate u100) ;; tokens per block per byte

(define-map capsule-storage
  { capsule-id: uint }
  {
    owner: principal,
    size: uint,
    last-paid-height: uint,
    content-hash: (buff 32)
  }
)

(define-public (store-capsule (capsule-id uint) (size uint) (content-hash (buff 32)))
  (let
    (
      (storage-cost (* size storage-rate))
    )
    (try! (ft-transfer? storage-token storage-cost tx-sender (as-contract tx-sender)))
    (ok (map-set capsule-storage
      { capsule-id: capsule-id }
      {
        owner: tx-sender,
        size: size,
        last-paid-height: block-height,
        content-hash: content-hash
      }
    ))
  )
)

(define-public (pay-storage (capsule-id uint))
  (let
    (
      (capsule (unwrap! (map-get? capsule-storage { capsule-id: capsule-id }) (err u404)))
      (blocks-elapsed (- block-height (get last-paid-height capsule)))
      (storage-cost (* (get size capsule) storage-rate blocks-elapsed))
    )
    (try! (ft-transfer? storage-token storage-cost tx-sender (as-contract tx-sender)))
    (ok (map-set capsule-storage
      { capsule-id: capsule-id }
      (merge capsule { last-paid-height: block-height })
    ))
  )
)

(define-read-only (get-capsule-info (capsule-id uint))
  (ok (map-get? capsule-storage { capsule-id: capsule-id }))
)

(define-read-only (get-storage-cost (capsule-id uint))
  (match (map-get? capsule-storage { capsule-id: capsule-id })
    capsule (ok (* (get size capsule) storage-rate (- block-height (get last-paid-height capsule))))
    (err u404)
  )
)

