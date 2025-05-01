import {
  AnchorSession,
  AnchorSessionOptions,
} from './Spatial Anchors/AnchorSession';

import { Anchor } from './Spatial Anchors/Anchor';
import { AnchorComponent } from './Spatial Anchors/AnchorComponent';
import { AnchorModule } from './Spatial Anchors/AnchorModule';

@component
export class AnchorPlacementController extends BaseScriptComponent {
  @input anchorModule: AnchorModule;

  @input camera: SceneObject;
  @input myObject: SceneObject;

  private anchorSession?: AnchorSession;

  async onAwake() {
    this.createEvent('OnStartEvent').bind(() => {
      this.onStart();
    });
  }

  async onStart() {
//    let anchorPos = this.camera.getTransform().getWorldTransform().mult(
//      mat4.fromTranslation(new vec3(0, 0, -5))
//    );
//    this.createAnchor(anchorPos);

    // Set up the AnchorSession options to scan for World Anchors
    const anchorSessionOptions = new AnchorSessionOptions();
    anchorSessionOptions.scanForWorldAnchors = true;

    // Start scanning for anchors
    this.anchorSession =
      await this.anchorModule.openSession(anchorSessionOptions);

    // Listen for nearby anchors
    this.anchorSession.onAnchorNearby.add(this.onAnchorNearby.bind(this));
  }

  public onAnchorNearby(anchor: Anchor) {
    print('Anchor found: ' + anchor.id);
    this.attachNewObjectToAnchor(anchor);
  }

  public async createAnchor(anchorPos: mat4) {
    // Compute the anchor position 5 units in front of user
    let toWorldFromDevice = this.camera.getTransform().getWorldTransform();
    let anchorPosition = anchorPos;

    // Create the anchor
    let anchor = await this.anchorSession.createWorldAnchor(anchorPosition);

    // Create the object and attach it to the anchor
    this.moveTD(anchorPos);

    // Save the anchor so it's loaded in future sessions
    try {
      this.anchorSession.saveAnchor(anchor);
    } catch (error) {
      print('Error saving anchor: ' + error);
    }
  }

  private moveTD(anchorPos: mat4) {
    myObject.getTransform().setWorldPosition(worldPos);
  }
}