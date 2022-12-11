const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.API_CLARIFAI}`);

const handleImageUrl = (req, res) => {
	stub.PostModelOutputs(
		{
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

			res.json(response);
		}
	);
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
