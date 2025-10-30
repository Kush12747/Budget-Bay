using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;
using BudgetBay.DTOs;

namespace BudgetBay.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        [HttpPost("create-checkout-session")]
        public ActionResult CreateCheckoutSession([FromBody] PaymentRequestDto request)
        {
            var domain = "http://localhost:5173/";

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = (long)(request.Amount * 100), // convert to cents
                            Currency = request.Currency,
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = request.ProductName
                            }
                        },
                        Quantity = 1
                    }
                },
                Mode = "payment",
                SuccessUrl = "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
                CancelUrl = "http://localhost:5173/cancel",
            };

            var service = new SessionService();
            var session = service.Create(options);

            return Ok(new { url = session.Url });
        }

        [HttpGet("session/{sessionId}")]
        public ActionResult GetSession(string sessionId)
        {
            var service = new SessionService();
            var session = service.Get(sessionId);

            if (session == null)
                return NotFound();

            return Ok(session);
        }
    }
}
