namespace AppleApi.Models.Product
{
    public class ProductsWithPaging
    {
        public List<Product>? products { get; set; }
        public long totalCount { get; set; }
    }
}
