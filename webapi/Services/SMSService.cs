using System;
using Twilio;
using Twilio.Rest.Api.V2010.Account;

namespace AppleApi.Services
{
    public class SMSService
    {
        private readonly string AccountSid = "AC45fd15963d3c3ee74eea2cec7b29eb32";
        private readonly string AuthToken = "58cae96d5e87719fc08ba3f027891fba";
        private readonly string TwilioPhoneNumber = "+17736494134";

        public void SendSms(string toPhoneNumber, string code)
        {
            TwilioClient.Init(AccountSid, AuthToken);
            var message = MessageResource.Create(
                body: $"{code}",
                from: new Twilio.Types.PhoneNumber(TwilioPhoneNumber),
                to: new Twilio.Types.PhoneNumber(toPhoneNumber)
            );
        }
    }
}
