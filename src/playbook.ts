// Guidance handed to the calling model through flow_status, so it plans scenes that Flow can actually run.
export const PLAYBOOK = {
  catalogue_checked: "2026-11-07",
  catalogue_notice: "Model availability and prices change. Entries below are historical estimates, not current quotes. Read Flow's live quote before generating. Omni 1.2 Flash was visible on 2026-11-07; its price has not been verified here.",
  characters: [
    "Always use Nano Banana Pro to generate character images, including portraits and full-body references. flow_character with describe uses Pro automatically; when generating separate references with flow_generate, explicitly set model to Nano Banana Pro.",
    "For a human character, use a clear single-person head-and-shoulders portrait in describe/image. Do not request full-body framing for the Portrait slot.",
    "Body is a separate slot. Supply body_image for an existing full-body reference. Automatic body generation is not implemented.",
    "Choose an explicit voice when a speaking character is intended. An omitted voice is not a configured voice. Report omitted body/voice rather than claiming a complete configuration.",
    "Use voice_sample for a representative line up to 120 characters, in the intended language. It previews a voice and does not set dialogue in future scenes. voice_performance and voice_custom_name request an experimental custom voice; verify it in Flow after saving. If preview fails or the save outcome is unclear, inspect the partially created character and voice before retrying.",
  ],
  workflow: [
    "For scene-image experiments use Nano Banana 2.1 with thinking level High. Once the creative direction is established, explicitly set model to Nano Banana Pro for the final scene image. Character images always use Pro. These image models do not generate video.",
    "Call flow_status first. If it returns a hint, relay it to the user and stop.",
    "Plan the whole piece as scenes of one shot each, then send them in ONE flow_generate call so file numbering and chaining work.",
    "Tell the user the expected credit total before queueing anything that costs credits.",
    "Call flow_wait repeatedly until finished is true; scenes run one at a time with 25-70 s pauses.",
    "To put the spoken words on screen: FIRST call flow_transcribe on the film (with `language`), show the user the words, flag anything that looks misheard (names especially, and words run together), propose the fixes, and wait for the user to confirm or correct them. Only then call flow_captions once, passing the agreed words as `text` (style bold for short-form, clean for subtitles).",
    "If an image batch finishes with \"still failed: scene ...\" in its note, call flow_retry with its job id: only those images are made again, under their own scene numbers.",
    "No call blocks for more than about 45 s. A reply with still_working and a task_id means Flow is still busy with it: pass the task_id to flow_wait, and never repeat the call.",
  ],
  models: {
    "Omni 1.1 Flash": "7 credits at 4s, 12 at 8s (720p). Supports duration 4/6/8/10 and 360p/720p. Best default for drafts and frame-to-frame transitions.",
    "Veo 3.1 - Lite": "10 credits, fixed 8s.",
    "Veo 3.1 - Fast": "20 credits, fixed 8s.",
    "Veo 3.1 - Quality": "100 credits, fixed 8s. Needs max_credits raised explicitly.",
    "Nano Banana 2.1": "Default image model for experiments, with thinking level High.",
    "Nano Banana Pro": "Use for all character images and final scene images; specify it explicitly in model for flow_generate.",
  },
  prompt_order: "subject and action -> shot size and camera move -> location -> visual style -> lighting -> sound/dialogue",
  prompt_rules: [
    "Write prompts in English, one continuous shot per scene, one camera move per scene.",
    "Name the camera behaviour explicitly (static locked-off, slow push-in, orbit, crane up, handheld).",
    "Repeat the full description of a recurring character or product in every scene; Flow has no memory between scenes.",
    "Put spoken lines in quotes and say who speaks; keep a line short enough for the clip length.",
    "For 9:16 social video set aspect_ratio on every scene.",
  ],
  continuity: [
    "chain_previous: true starts a scene on the last frame of the scene before it, giving one continuous take across clips.",
    "first_frame + last_frame makes Flow animate between two stills; generate both stills as free images first for controlled transitions.",
    "reference_images (max 3) keep a product or person consistent without fixing the first frame.",
  ],
};
