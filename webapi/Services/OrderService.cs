﻿using AppleApi.Models;
using AppleApi.Models.Order;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AppleApi.Common;
using AppleApi.Interfaces;
using AppleApi.Models.Category;
using Microsoft.EntityFrameworkCore;

namespace AppleApi.Services
{
    internal class OrderService : CommonRepository<Order>, IOrderService
    {
        public OrderService(IOptions<AppleDatabaseSettings> settings)
        : base(settings, "Order")
        {
        }

        public async Task ScanAndCancelOrders()
        {
            List<Order> orders = new();
            FilterDefinition<Order> filter = Builders<Order>.Filter.Empty;
            filter = filter & Builders<Order>.Filter.Lt(x => x.DateCreated, DateTime.UtcNow.AddHours(-1).AddMinutes(-40));
            Console.WriteLine(1);
            filter = filter & Builders<Order>.Filter.Eq(x => x.Status, "Placed");
            orders = await FindManyAsync(filter);
            foreach (var order in orders)
            {
                order.Status = "Canceled";
                await UpdateOneAsync(order.Id, order);
            }
        }
    }
}

