import { CameraModel } from "./Features/ByCamera";
import { LocationModel } from "./Features/ByLocation";
import { TagModel } from "./Features/ByTag";
import { ModelShow } from "./Features/Selector";

function App() {
	return (
		<ModelShow 
			cameras={<CameraModel />} 
			location={<LocationModel />}
			tags={<TagModel />}
		/>
	);
}

export default App;