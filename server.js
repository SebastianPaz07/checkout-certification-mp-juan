const express = require("express");
const app = express();
const cors = require("cors");
const mercadopago = require("mercadopago");

mercadopago.configure({
	access_token: "APP_USR-8902774665784533-092911-fab78ca802b6475923ebb446b02fee62-1160743707",
	integrator_id: "dev_24c65fb163bf11ea96500242ac130004"
});

app.use(express.urlencoded({
	extended: false
}));
app.use(express.json());
app.use(cors());
app.use(express.static("client"));

app.get("/", function (req, res) {
	res.status(200).sendFile("index.html");
});

app.post("/create_preference", (req, res) => {
	let preference = {
		payer: {
			name: "Lalo",
			surname: "Landa",
			email: "test_user_51300629@testuser.com",
			phone: {
				area_code: "11",
				number: 3254591145
			},
			identification: {
				type: "CC",
				number: "1212658856"
			},
			address: {
				street_name: "Calle Falsa",
				street_number: 123,
				zip_code: "110110"
			}
		},
		items: [{
			id: 1234,
			title: req.body.description,
			description: "Dispositivo móvil de Tienda e-commerce",
			picture_url: "img/computadora.jpg",
			unit_price: Number(req.body.price),
			quantity: Number(req.body.quantity),
			currecy_id: "COP"
		}],
		back_urls: {
			success: "https://chechout-certification.onrender.com/success",
			failure: "https://chechout-certification.onrender.com/failure",
			pending: "https://chechout-certification.onrender.com/pending"
		},
		auto_return: "approved",
		payment_methods: {
			excluded_payment_methods: [{
				id: "visa"
			}],
			installments: 5,
		},
		external_reference: "jspazgantiva21@gmail.com",
		notification_url: "https://webhook.site/a68a6b91-20d3-4b4b-a488-390a8706ecf6"
	};
	mercadopago.preferences.create(preference)
		.then(function (response) {
			console.log(response.body)
			res.json({
				id: response.body.id
			});
		}).catch(function (error) {
			console.log(error);
		});
});

app.get('/failure', function (req, res) {
	console.log(req.query)
	res.json(getPaymentResponse(req));
});

app.get('/pending', function (req, res) {
	console.log(req.query)
	res.json(getPaymentResponse(req));
});


app.get('/success', function (req, res) {
	console.log(req.query)
	res.json(getPaymentResponse(req));
});

function getPaymentResponse(req) {
	return {
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id,
		PaymentMethod: req.query.payment_method_id,
		CollectionId: req.query.collection_id,
		CollectionStatus: req.query.collection_status,
		PaymentType: req.query.payment_type,
		PreferenceId: req.query.preference_id,
		SiteId: req.query.site_id,
		ProcessingMode: req.query.processing_mode,
		MerchantAccountId: req.query.merchant_account_id,
	}
}

app.listen(process.env.PORT || 5000, () => {
	console.log("The server is now running on Port" + process.env.PORT || 5000);
});