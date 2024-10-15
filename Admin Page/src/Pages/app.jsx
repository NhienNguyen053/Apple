import { Helmet } from 'react-helmet-async';

import { AppView } from '../sections/overview/view/app-view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <AppView />
    </>
  );
}
