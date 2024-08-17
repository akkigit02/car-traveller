import React from 'react'
import AdminDashboard from '../../components/admin/Dashboard'

export default function ClientRoute() {
  return (
    <main className="position-relative h-100vh">
      <AppTopNav />
      <div className="row mx-0 mt-3">
        <div className="col-lg-2 col-md-2 col-12 pe-0">
          <div className="border rounded shadow side-nav-h">
            <SideNavBar />
          </div>
        </div>
        <div className="col-lg-10 col-md-10 col-12">
          <div className="border rounded shadow p-3">
            <Routes>
              <Route path={`/payment`} Component={AdminDashboard} exact />
            </Routes>
          </div>
        </div>
      </div>
      <footer className="p-3 border-top w-100 shadow  d-flex justify-content-center position-absolute bottom-0">
        <p className="mb-0">© Copyright 2024 by dddcabs.com</p>
      </footer>
    </main>
  )
}
