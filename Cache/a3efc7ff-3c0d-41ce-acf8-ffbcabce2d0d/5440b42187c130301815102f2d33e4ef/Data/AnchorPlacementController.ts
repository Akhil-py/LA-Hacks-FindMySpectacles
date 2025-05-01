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
  @input a: Anchor;

  @input camera: SceneObject;

  private anchorSession?: AnchorSession;

  async onAwake() {
    this.createEvent('OnStartEvent').bind(() => {
      this.onStart();
    });
  }

  async onStart() {
    this.setupAnchor();
        
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
  }

  private async setupAnchor() {
    // Compute the anchor position 5 units in front of user
    let toWorldFromDevice = this.camera.getTransform().getWorldTransform();
    let anchorPosition = toWorldFromDevice.mult(
      mat4.fromTranslation(new vec3(0, 0, 0))
    );

    // Create the anchor
    this.a = await this.anchorSession.createWorldAnchor(anchorPosition);

    // Save the anchor so it's loaded in future sessions
    try {
      this.anchorSession.saveAnchor(this.a);
    } catch (error) {
      print('Error saving anchor: ' + error);
    }
  }
}