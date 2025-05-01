# LA-Hacks-FindMy-Spectacles

A Snap Spectacles Lens built by a team of three for **LA Hacks 2025**. It helps you locate misplaced items in real time using object detection and Spatial Anchors.

---

## 🧠 Concept

**Original idea:** continuously track your movement, build a 3D map of your environment, and record where you place objects. When you misplace something, simply ask your Spectacles and it will navigate you back to the exact spot.

**Actual implementation:** you ask your Spectacles “Where did I lose my ___?” and then carry on normally. As soon as your missing item comes into view, the Lens automatically:
1. Places a Spatial Anchor on the detected object  
2. Spawns a true 3D arrow in your field of view  
3. Points you straight to your lost item

Once the lens finds an object, it remembers its location in a 3D map, so you can turn around and go to a different room, and the arrow will still point towards its last known location.

---

## 🚀 Features

- **Tap-to-Find** – single-shot detection on button press.  
- **Object Anchoring** – anchors each found item in world space.  
- **Live Pointer** – spawns a true 3D arrow that always points to your lost object.  
- **Configurable** – model size, confidence, distance thresholds & send-delay.  
- **On-screen logs** and countdown feedback.

---

## 🛠️ Tech Stack

- **Lens Studio** (Snap Spectacles SDK)  
- **Spectacles Interaction Kit** (SIK)  
- **Hugging Face** object-detection API (YOLO-based)  
- **Spatial Anchors** for persistent world placement  
- **Hand Gestures** (planned for future)

---

## 📦 Project Structure

```
/Scripts • DetectionManager.js // main capture + API + anchoring + arrow spawner • AnchorController.js // wraps Spatial Anchors API • CameraTexture.js // (optional) live camera feed provider

/Resources /Prefabs • DetectionPrefab // 3D bounding-box + UI prefab • ArrowPrefab // 3D arrow mesh SceneObject /Materials /Meshes
```


---

## ⚙️ Configuration

1. **Attach** `DetectionManager.js` to an empty SceneObject.  
2. **Input Configuration**  
   - **Texture** (or enable live camera mode + `CameraTexture.js`)  
   - **Button**: your Interactable for “Detect”  
3. **Model Configuration**: size, confidence & distance thresholds, send delay  
4. **API Configuration**: your Hugging Face token + on-screen log Text  
5. **Detection Prefab**: drag in your bounding-box prefab  
6. **Arrow Prefab**: drag in your 3D arrow prefab (actual arrow mesh)  
7. **Anchor Controller**: your Spatial Anchor script component  
8. **Pinhole Capture**: for projecting 2D→3D

---

## ▶️ Usage

1. Preview in Spectacles Simulator or on-device.  
2. Tap the “Detect” button.  
3. Watch the countdown.  
4. Lens detects your target, anchors it, and spawns an arrow pointing at it.  
5. Follow the arrow to recover your lost item!

---

## 🔮 What’s Next?

- Broader object-detection categories  
- Mini-map view for out-of-sight items  
- Voice commands (“Find my keys”)  
- Hand-gesture shortcuts (set reminders, anchor placement)  
- DAIN-powered “packing list” suggestions for leaving the house

---

## 🤖 How It Works

1. **User tap** → `handleTriggerEndSingleDetection()`  
2. **Capture texture** → static image or live camera  
3. **Encode & POST** → HF API via `remoteServiceModule.fetch()`  
4. **Parse detections** → filter by class & confidence  
5. **Anchor & visualize** –  
   - **DetectionPrefab** at projected 3D location  
   - **ArrowPrefab** instantiated in front of camera, `lookAt()` target  
6. **Cleanup** → remove old anchors & arrows on each new detection

---

## 🤝 Contributing

1. Fork the repo  
2. Branch `feature/YourIdea`  
3. Open a PR describing your changes

---

## 📄 License

Released under the MIT License. See [LICENSE](./LICENSE) for details.
