using BudgetBay.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BudgetBay.DTOs
{

    public class UserBidDto
    {
        public string Username { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }
}
