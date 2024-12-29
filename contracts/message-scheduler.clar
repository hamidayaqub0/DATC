;; Message Scheduler Contract

(define-data-var last-message-id uint u0)

(define-map scheduled-messages
  { message-id: uint }
  {
    sender: principal,
    recipient: principal,
    content-hash: (buff 32),
    delivery-time: uint,
    is-delivered: bool
  }
)

(define-public (schedule-message (recipient principal) (content-hash (buff 32)) (delivery-time uint))
  (let
    (
      (new-id (+ (var-get last-message-id) u1))
    )
    (asserts! (> delivery-time block-height) (err u400))
    (map-set scheduled-messages
      { message-id: new-id }
      {
        sender: tx-sender,
        recipient: recipient,
        content-hash: content-hash,
        delivery-time: delivery-time,
        is-delivered: false
      }
    )
    (var-set last-message-id new-id)
    (ok new-id)
  )
)

(define-public (mark-as-delivered (message-id uint))
  (let
    (
      (message (unwrap! (map-get? scheduled-messages { message-id: message-id }) (err u404)))
    )
    (asserts! (>= block-height (get delivery-time message)) (err u403))
    (ok (map-set scheduled-messages
      { message-id: message-id }
      (merge message { is-delivered: true })
    ))
  )
)

(define-read-only (get-message (message-id uint))
  (ok (map-get? scheduled-messages { message-id: message-id }))
)

(define-read-only (get-deliverable-messages)
  (filter is-deliverable (map-to-list scheduled-messages))
)

(define-private (is-deliverable (message { message-id: uint, sender: principal, recipient: principal, content-hash: (buff 32), delivery-time: uint, is-delivered: bool }))
  (and (>= block-height (get delivery-time message)) (not (get is-delivered message)))
)

