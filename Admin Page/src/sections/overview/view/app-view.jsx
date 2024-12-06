import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useState, useEffect } from 'react';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import Cookies from 'js-cookie';

// ----------------------------------------------------------------------

export function AppView() {
  const API_BASE_URL = process.env.REACT_APP_API_HOST;
  const [data, setData] = useState();
  const jwtToken = Cookies.get('jwtToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Users/getDashboardData`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `bearer ${jwtToken}`
          },
        });
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container maxWidth="xl">
    {data ? 
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Active Products"
            total={data.products}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Users"
            total={data.users}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Orders"
            total={data.orders}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Revenue ($)"
            total={data.revenue}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Yearly Orders"
            chart={{
              labels: [
                Object.keys(data.yearlyOrders)[0],
                Object.keys(data.yearlyOrders)[1],
                Object.keys(data.yearlyOrders)[2],
                Object.keys(data.yearlyOrders)[3],
                Object.keys(data.yearlyOrders)[4],
                Object.keys(data.yearlyOrders)[5],
                Object.keys(data.yearlyOrders)[6],
                Object.keys(data.yearlyOrders)[7],
                Object.keys(data.yearlyOrders)[8],
                Object.keys(data.yearlyOrders)[9],
                Object.keys(data.yearlyOrders)[10],
                Object.keys(data.yearlyOrders)[11]
              ],
              series: [
                {
                  name: 'Total',
                  type: 'column',
                  fill: 'solid',
                  data: [data.yearlyOrders.Jan, data.yearlyOrders.Feb, data.yearlyOrders.Mar, data.yearlyOrders.Apr, data.yearlyOrders.May, data.yearlyOrders.Jun, data.yearlyOrders.Jul, data.yearlyOrders.Aug, data.yearlyOrders.Sep, data.yearlyOrders.Oct, data.yearlyOrders.Nov, data.yearlyOrders.Dec],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Total Orders"
            chart={{
              series: [
                { label: 'Refunded', value: data.refundedOrders },
                { label: 'Paid', value: data.paidOrders },
                { label: 'Processing', value: data.processingOrders },
                { label: 'Shipping', value: data.shippingOrders },
                { label: 'Delivered', value: data.deliveredOrders },
              ],
            }}
          />
        </Grid>

      </Grid>
    : <></> }
    </Container>
  );
}
