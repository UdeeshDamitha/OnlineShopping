
using MailKit.Security;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace EmailService
{
    public class EmailSender
    {
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _smtpUser;
        private readonly string _smtpPass;

        public EmailSender(string smtpServer, int smtpPort, string smtpUser, string smtpPass)
        {
            _smtpServer = smtpServer;
            _smtpPort = smtpPort;
            _smtpUser = smtpUser;
            _smtpPass = smtpPass;
        }

        public async Task SendEmailAsync(string recipientEmail, string subject, string body)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Your Name", _smtpUser));
            message.To.Add(new MailboxAddress("", recipientEmail));
            message.Subject = subject;

            message.Body = new TextPart("plain")
            {
                Text = body
            };

            //using (var client = new SmtpClient())
            //{
            //    try
            //    {
            //        await client.ConnectAsync(_smtpServer, _smtpPort, SecureSocketOptions.StartTls);
            //        await client.AuthenticateAsync(_smtpUser, _smtpPass);
            //        await client.SendAsync(message);
            //    }
            //    catch (Exception ex)
            //    {
            //        Console.WriteLine($"Error sending email: {ex.Message}");
            //    }
            //    finally
            //    {
            //        await client.DisconnectAsync(true);
            //        client.Dispose();
            //    }
            //}
        }
    }
}
