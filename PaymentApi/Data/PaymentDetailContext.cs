using Microsoft.EntityFrameworkCore;
using PaymentApi.Models;

namespace PaymentApi.Data
{
    public class PaymentDetailContext : DbContext
    {
        public PaymentDetailContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<PaymentDetail> PaymentDetails { get; set; }
    }
}
