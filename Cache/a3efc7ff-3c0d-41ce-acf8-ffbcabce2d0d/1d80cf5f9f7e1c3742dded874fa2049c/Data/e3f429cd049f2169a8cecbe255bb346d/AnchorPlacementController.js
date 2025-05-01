"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnchorPlacementController = void 0;
var __selfType = requireType("./AnchorPlacementController");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const AnchorSession_1 = require("./Spatial Anchors/AnchorSession");
const AnchorComponent_1 = require("./Spatial Anchors/AnchorComponent");
let AnchorPlacementController = class AnchorPlacementController extends BaseScriptComponent {
    async onAwake() {
        this.createEvent('OnStartEvent').bind(() => {
            this.onStart();
        });
    }
    async onStart() {
        this.createAnchor();
        // Set up the AnchorSession options to scan for World Anchors
        const anchorSessionOptions = new AnchorSession_1.AnchorSessionOptions();
        anchorSessionOptions.scanForWorldAnchors = true;
        // Start scanning for anchors
        this.anchorSession =
            await this.anchorModule.openSession(anchorSessionOptions);
        // Listen for nearby anchors
        this.anchorSession.onAnchorNearby.add(this.onAnchorNearby.bind(this));
    }
    onAnchorNearby(anchor) {
        print('Anchor found: ' + anchor.id);
        this.attachNewObjectToAnchor(anchor);
    }
    updateAnchor(anchor) {
        this.anchor = anchor;
    }
    async createAnchor() {
        // Compute the anchor position 5 units in front of user
        let toWorldFromDevice = this.camera.getTransform().getWorldTransform();
        let anchorPosition = toWorldFromDevice.mult(mat4.fromTranslation(new vec3(0, 0, -5)));
        // Create the anchor
        let anchor = await this.anchorSession.createWorldAnchor(anchorPosition);
        // Create the object and attach it to the anchor
        this.attachNewObjectToAnchor(anchor);
        // Save the anchor so it's loaded in future sessions
        try {
            this.anchorSession.saveAnchor(anchor);
        }
        catch (error) {
            print('Error saving anchor: ' + error);
        }
    }
    attachNewObjectToAnchor(anchor) {
        // Create a new object from the prefab
        let object = this.prefab.instantiate(this.getSceneObject());
        object.setParent(this.getSceneObject());
        // Associate the anchor with the object by adding an AnchorComponent to the
        // object and setting the anchor in the AnchorComponent.
        let anchorComponent = object.createComponent(AnchorComponent_1.AnchorComponent.getTypeName());
        anchorComponent.anchor = anchor;
    }
};
exports.AnchorPlacementController = AnchorPlacementController;
exports.AnchorPlacementController = AnchorPlacementController = __decorate([
    component
], AnchorPlacementController);
//# sourceMappingURL=AnchorPlacementController.js.map