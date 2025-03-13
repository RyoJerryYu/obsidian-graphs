import { GraphInfo } from "./types";

export class Utils {

	constructor() {
	}

	defaultGraphInfo(): GraphInfo {
		// set default values
		return {bounds: [0,0,0,0],
				maxBoundingBox: JXG.Options.board.maxBoundingBox,
				keepAspectRatio: false,
				drag: true,
				showNavigation: true,
				axis: true,
				defaultAxes: JXG.Options.board.defaultAxes,
				elements: [],
				height: undefined,
				width: undefined,
				bounds3d: undefined,
				att3d: undefined};
	}

}

