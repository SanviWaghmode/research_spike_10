// ------------------------------------------------------
// SPK-010: AI ↔ Human Call Handoff Prototype
// Fastify Orchestration Layer
// Author: Sanvi Waghmode
// Purpose: Validate feasibility of bidirectional call transfer
// ------------------------------------------------------

const fastify = require('fastify')({ logger: true })

// ------------------------------------------------------
// POST /transfer-call
// This endpoint simulates the Client Tool webhook
// triggered by the AI agent when a handoff is required.
// ------------------------------------------------------

fastify.post('/transfer-call', async (req, reply) => {

  // Extract payload sent by AI agent
  const { callId, target, reason } = req.body

  console.log("\n==============================")
  console.log("📞 Handoff Trigger Received")
  console.log("==============================")

  console.log("Call ID:", callId)
  console.log("Requested Target:", target)
  console.log("Escalation Reason:", reason)

  // ------------------------------------------------------
  // Context Preservation Simulation
  // In production, this would fetch transcript via
  // conversation_id and generate a real summary.
  // ------------------------------------------------------

  const summary = "User appears frustrated regarding refund delay"
  console.log("📝 Context Summary Prepared:", summary)

  // ------------------------------------------------------
  // Measure backend orchestration latency
  // (Excludes telephony provider ring time)
  // ------------------------------------------------------

  const startTime = Date.now()

  // ------------------------------------------------------
  // Simulated Telephony Routing Logic
  // In real production:
  // - This would call Twilio API or SIP REFER
  // - Live call would be patched to human or AI endpoint
  // ------------------------------------------------------

  if (target === "human") {
    console.log("➡️ Routing call to Human Support Queue...")
  } else if (target === "ai") {
    console.log("🤖 Routing call back to AI Agent...")
  } else {
    console.log("⚠️ Unknown target — no routing performed")
  }

  const endTime = Date.now()
  const latency = endTime - startTime

  console.log("⏱ Backend Handoff Latency:", latency, "ms")
  console.log("✅ Handoff Simulation Complete\n")

  // Respond back to AI agent
  return {
    status: "transfer_initiated",
    callId,
    target,
    latency_ms: latency
  }
})

// ------------------------------------------------------
// Start server (Control Plane Listener)
// ------------------------------------------------------

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`🚀 Orchestration Layer running at ${address}`)
})
