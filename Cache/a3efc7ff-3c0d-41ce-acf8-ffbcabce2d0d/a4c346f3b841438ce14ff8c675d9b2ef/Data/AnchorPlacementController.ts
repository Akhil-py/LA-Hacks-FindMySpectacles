import {
  AnchorSession,
  AnchorSessionOptions,
} from './Spatial Anchors/AnchorSession';
import { WorldAnchor } from './Spatial Anchors/WorldAnchor';
import { AnchorComponent } from './Spatial Anchors/AnchorComponent';
import { AnchorModule } from './Spatial Anchors/AnchorModule';

@component
export class AnchorPlacementController extends BaseScriptComponent {
  @input anchorModule!: AnchorModule;
  @input camera!: SceneObject;
  @input prefab!: ObjectPrefab;

  // 1. Tell TS that this session produces WorldAnchors
  private anchorSession?: AnchorSession<WorldAnchor>;

  async onAwake() {
    this.createEvent('OnStartEvent').bind(() => this.onStart());
  }

  private async onStart() {
    const opts = new AnchorSessionOptions();
    opts.scanForWorldAnchors = true;
    // 2. Explicitly pass <WorldAnchor> so the generic is known
    this.anchorSession = await this.anchorModule.openSession<WorldAnchor>(opts);
    this.anchorSession.onAnchorNearby.add(this.onAnchorNearby.bind(this));
  }

  private onAnchorNearby(anchor: WorldAnchor) {
    print(`Anchor found: ${anchor.id}`);
    this.attachNewObjectToAnchor(anchor);
  }

  private attachNewObjectToAnchor(anchor: WorldAnchor) {
    // Instantiate your prefab under this script’s SceneObject
    const obj = this.prefab.instantiate(this.getSceneObject());
    obj.setParent(this.getSceneObject());

    // 3. Add an AnchorComponent which will automatically
    //    snap the object into the anchor’s world‐space pose.
    const ac = obj.createComponent(
      AnchorComponent.getTypeName()
    ) as AnchorComponent;
    ac.anchor = anchor;
  }
}
