using MongoDB.Bson;

namespace AppleApi.Extensions
{
    public static class Extensions
    {
        public static ObjectId ToObjectId(this string strObjectId)
        {
            if (!strObjectId.IsNullOrWhiteSpace())
            {
                ObjectId.TryParse(strObjectId.Trim(), out ObjectId _return);
                return _return;
            }
            return ObjectId.Empty;
        }

        public static bool IsNullOrWhiteSpace(this string str)
        {
            if (str != null && str.ToUpper() == "NULL") return true;
            return string.IsNullOrWhiteSpace(str);
        }
    }
}
