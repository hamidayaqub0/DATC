;; Future Nodes Contract

(define-map future-nodes
  { node-address: principal }
  {
    reputation: int,
    last-active: uint
  }
)

(define-public (register-node)
  (ok (map-set future-nodes
    { node-address: tx-sender }
    {
      reputation: 0,
      last-active: block-height
    }
  ))
)

(define-public (update-node-activity)
  (match (map-get? future-nodes { node-address: tx-sender })
    node (ok (map-set future-nodes
      { node-address: tx-sender }
      (merge node { last-active: block-height })
    ))
    (err u404)
  )
)

(define-public (reward-node (node-address principal))
  (match (map-get? future-nodes { node-address: node-address })
    node (ok (map-set future-nodes
      { node-address: node-address }
      (merge node {
        reputation: (+ (get reputation node) 1)
      })
    ))
    (err u404)
  )
)

(define-read-only (get-node-info (node-address principal))
  (ok (map-get? future-nodes { node-address: node-address }))
)

(define-read-only (is-node-active (node-address principal))
  (match (map-get? future-nodes { node-address: node-address })
    node (< (- block-height (get last-active node)) u1440)
    false
  )
)

