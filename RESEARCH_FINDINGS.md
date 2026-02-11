# 🔬 SPK-010: Refined Research Findings

**Researcher:** Sanvi Waghmode  
**Date:** February 11, 2026  
**Spike Duration:** 3 Days  
**Status:** Completed  

---

## Executive Summary

During this spike, I evaluated whether ElevenLabs requires a custom backend orchestration layer for AI ↔ Human call transfers.

### Final Finding

ElevenLabs provides **native system tools** that support production-grade call transfers:

- `transfer_to_number` → AI → Human  
- `transfer_to_agent` → AI ↔ AI  

These tools operate at the telephony protocol level (SIP REFER or conference transfer), eliminating the need for a custom webhook-based routing layer for basic escalation use cases.

For the spike’s stated requirements (AI ↔ Human handoff with context preservation), native tools are sufficient and superior in latency and reliability.

---

## 1. Problem Framing

Enterprise AI agents must:

- Escalate to humans when confidence drops or frustration is detected  
- Allow humans to transfer routine queries back to AI  
- Preserve context across handoff  
- Minimize “dead air” during transfer  

**Key architectural question:**

> Should transfer logic be handled by ElevenLabs natively, or by a custom backend via client tools?

---

## 2. Native Transfer Capabilities Identified

### A) `transfer_to_number` (AI → Human)

This built-in system tool enables live call transfer using two methods:

#### 1️⃣ Conference Transfer (Default)

- Dials human endpoint  
- Adds to conference  
- Removes AI after connection  
- Slightly higher latency (dial tone audible)  

#### 2️⃣ SIP REFER Transfer (Recommended)

- Protocol-level call transfer  
- AI exits call immediately  
- Direct carrier-level handoff  
- Lower latency (~sub-second possible)  

#### Context Preservation

With SIP REFER:

- `X-Conversation-ID` header automatically included  
- `X-Caller-ID` included  
- Custom SIP headers supported  

This enables context passing without external middleware.

---

### B) `transfer_to_agent` (AI ↔ AI)

Allows routing between configured agents:

- Specialized AI handling (billing, tech support, etc.)  
- Seamless conversational continuity  
- Zero additional infrastructure required  

This supports Human → AI deflection scenarios.

---

## 3. Latency Analysis

Transfer latency is critical because users perceive silence as failure.

| Method | Estimated Dead Air |
|-------|------------------|
| SIP REFER (Native) | ~200–500ms |
| Conference Transfer | ~1–2 seconds |
| Custom Webhook → Twilio API | ~2–5 seconds |

### Key Insight

Native transfer avoids:

- Webhook round-trip  
- Backend processing  
- Secondary telephony API calls  

Transfer occurs at the **protocol layer**, not the application layer — materially reducing dead air and failure points.

---

## 4. Custom Client Tool Alternative

Custom client tools enable:

- CRM-based routing decisions  
- Dynamic destination lookup  
- Advanced logging  
- Business-hour logic  
- External authentication workflows  

However, for simple escalation/deflection they introduce:

- Additional latency  
- More infrastructure  
- Greater operational complexity  

**Conclusion:**  
Custom tools should handle business logic — not basic transfer mechanics.

---

## 5. Architecture Comparison

### Option A — Native System Tool (Recommended)


**Advantages:**

- Lowest latency  
- Minimal engineering overhead  
- Platform-managed reliability  
- Built-in metadata passing  

**Limitations:**

- Pre-configured destinations  
- Rule-based routing only  

---

### Option B — Custom Orchestration Backend


**Advantages:**

- Full control  
- Dynamic routing  
- CRM integrations  

**Trade-offs:**

- Increased dead air  
- More failure points  
- Higher maintenance  

---

## 6. Context Preservation Findings

Native transfer preserves:

- Conversation ID  
- Caller metadata  
- Custom SIP headers (with SIP REFER)  

Additional implementation required for:

- Transcript summarization  
- Real-time dashboard push  
- CRM enrichment  

**Key distinction:**

Context preservation is a **UX integration problem**, not a telephony protocol limitation.

---

## 7. Final Recommendation

### ✅ Adopt Native Tools for Core Transfer

For SPK-010’s defined scope, native ElevenLabs system tools are technically superior.

**Use SIP REFER whenever available** to minimize latency.

---

### 🔁 Extend with Custom Logic Only If:

- Routing depends on CRM data  
- Agent availability must be checked dynamically  
- Multi-region business rules required  
- Custom analytics needed  

**Hybrid approach recommended:**


---

## 8. Engineering Insight

> Call transfer should occur at the telephony protocol layer, not the application layer.

The AI decides **when** to transfer.  
The platform executes **how** to transfer.

This separation delivers:

- Lower latency  
- Higher reliability  
- Cleaner system boundaries  

---

## 9. Conclusion

The hypothesis that custom webhooks were required for call transfer was disproven.

ElevenLabs provides native telephony control primitives that:

- Support AI ↔ Human escalation  
- Support AI ↔ AI deflection  
- Preserve metadata  
- Reduce dead air  

**For enterprise deployment, native tools should be the default strategy.**
