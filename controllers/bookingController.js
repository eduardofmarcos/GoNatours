const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("./../models/tourModel");
const catchAsync = require("./../utils/catchAsync");
const Booking = require("./../models/bookingModel");
const factory = require("./../controllers/handlerFactory");
const User = require("./../models/userModel");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1)get the currently booktour
  const tour = await Tour.findById(req.params.tourId);
  //2)create a checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    // success_url: `${req.protocol}://${req.get('host')}/?tour=${
    //   req.params.tourId
    // }&&user=${req.user._id}&&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get("host")}/mytours`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: "usd",
        quantity: 1
      }
    ]
  });
  //3) send it to client
  res.status(200).json({
    status: "success",
    session
  });
});

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   //this is a temporary function. Because this is unsecure, cause everyone can make a booking
//   const { tour, user, price } = req.query;

//   if (!tour && !user && !price) return next();
//   await Booking.create({ tour, user, price });

//   res.redirect(req.originalUrl.split('?')[0]);
// });

const createBookingCheckout = catchAsync(async session => {
  const userObj = await User.findOne({ email: session.customer_email });
  const user = userObj._id;
  const price = session.line_items[0].amount / 100;
  const tour = session.client_reference_id;
  await Booking.create({ tour, user, price });
});

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`WebHook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    createBookingCheckout(event.data.object);
  }

  res.status(200).json({
    received: true
  });
};

exports.createOneBooking = factory.createOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.getSingleBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
