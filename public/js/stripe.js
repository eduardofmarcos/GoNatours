const stripe = Stripe('pk_test_qOvopEauzPyFS3vIAicfcsYZ00G03Weztm');
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async tourId => {
  try {
    //1) get checkout session form api
    const session = await axios(
      `/api/v1/bookings/checkout/${tourId}`
    );
    console.log(session);
    //2) create process form + charge the credit cards}
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    showAlert('Error: ', err);
  }
};
