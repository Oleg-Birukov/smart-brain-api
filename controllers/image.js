// const Clarifai = require("clarifai");
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key d7f2fd428f8c4f9aa8693d00a8f5fe42");

// const app = new Clarifai.App({
// 	apiKey: "d7f2fd428f8c4f9aa8693d00a8f5fe42",
// });

const handleImageUrl = (req, res) => {
	stub.PostModelOutputs(
		{
			// This is the model ID of a publicly available General model. You may use any other public or custom model ID.
			model_id: "a403429f2ddf4b49b307e318f00e528b",
			inputs: [{ data: { image: { url: req.body.input } } }],
		},
		metadata,
		(err, response) => {
			if (err) {
				console.log("Error: " + err);
				return res.status(400).json(err);
			}

			if (response.status.code !== 10000) {
				console.log(
					"Received failed status: " +
						response.status.description +
						"\n" +
						response.status.details
				);
				return res.status(400).json("Received failed status: " +
						response.status.description +
						"\n" +
						response.status.details);;
			}

			// console.log("Predicted concepts, with confidence values:");
			// for (const c of response.outputs[0].data) {
			// 	console.log(c.name + ": " + c.value);
			// }
			res.json(response);
		}
	);
	// console.log(req.body);
	// app.models
	// 	.predict(
	// 		// HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
	// 		// A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
	// 		// for the Face Detect Mode: https://www.clarifai.com/models/face-detection
	// 		// If that isn't working, then that means you will have to wait until their servers are back up. Another solution
	// 		// is to use a different version of their model that works like the ones found here: https://github.com/Clarifai/clarifai-javascript/blob/master/src/index.js
	// 		// so you would change from:
	// 		// .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
	// 		// to:
	// 		// .predict('53e1df302c079b3db8a0a36033ed2d15', this.state.input)
	// 		Clarifai.FACE_DETECT_MODEL,
	// 		req.body.input
	// 	) //.then(response => response.json())
	// 	.then((data) => {
	// 		console.log(data);
	// 		return res.json(data);
	// 	})
	// 	.catch((err) => {
	// 		res.status(400).json("unable to predict image");
	// 	});
};

const handleImage = (db) => (req, res) => {
	const { id } = req.body;
	db("users")
		.where({ id })
		.returning("entries")
		.increment("entries")
		.then((data) => {
			if (data.length) {
				res.json(data[0].entries);
			} else {
				res.status(404).json("not found");
			}
		})
		.catch((err) => res.status(400).json("unable to get entries"));
};

module.exports = {
	handleImage,
	handleImageUrl,
};
