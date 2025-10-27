using System.ComponentModel.DataAnnotations;

namespace BudgetBay.DTOs
{
    public class PaymentRequestDto
    {
        public string ProductName { get; set; } = string.Empty;
        public long Amount { get; set; }
        public string Currency { get; set; } = "usd";
    }
}