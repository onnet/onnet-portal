export default [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    component: './onnet-portal/core/layouts/LoginLayout',
    routes: [{ path: '/login', name: 'login', component: './onnet-portal/core/pages/login' }],
  },
  { path: '/dashboard', redirect: '/int/dashboard' },
  {
    path: '/int',
    component: './onnet-portal/core/layouts/BasicLayout',
    Routes: ['src/pages/onnet-portal/core/layouts/Authorized'],
    authority: ['admin', 'user', 'reseller'],
    routes: [
      {
        name: 'dashboard',
        path: '/int/dashboard',
        component: './onnet-portal/core/pages/dashboard',
        icon: 'dashboard',
      },
      { path: '/int/zone', component: './onnet-portal/core/pages/dashboard/zone_info' },
      {
        name: 'reseller_portal',
        path: '/int/reseller_portal',
        icon: 'account-book',
        authority: ['superduper_admin', 'reseller', '!354c50fb268bf2da40e317dee90f7de3'],
        routes: [
          {
            name: 'accounts',
            path: '/int/reseller_portal/accounts',
            component: './onnet-portal/reseller/portal',
          },
          {
            name: 'settings',
            path: '/int/reseller_portal/settings',
            component: './onnet-portal/reseller/settings',
          },
          {
            name: 'monitor',
            path: '/int/reseller_portal/monitor', // icon: 'user',
            routes: [
              {
                name: 'current_calls',
                path: '/int/reseller_portal/monitor/calls',
                component: './onnet-portal/reseller/monitor/current_calls',
              },
              {
                name: 'amqp_messages',
                path: '/int/reseller_portal/monitor/amqp',
                component: './onnet-portal/reseller/monitor/amqp_messages',
              },
              {
                name: 'current_sip_registrations',
                path: '/int/reseller_portal/monitor/sip_registrations',
                component: './onnet-portal/reseller/monitor/current_registrations',
              },
            ],
          },
        ],
      },
      {
        path: '/int/accounting',
        name: 'accounting',
        icon: 'money-collect',
        authority: ['lanbilling'],
        routes: [
          {
            name: 'payments',
            path: '/int/accounting/finance_details',
            component: './onnet-portal/lb/finance_details',
            authority: ['lanbilling'],
          },
          {
            name: 'documents',
            path: '/int/accounting/documents',
            component: './onnet-portal/lb/documents',
            authority: ['lanbilling'],
          },
          {
            name: 'statistics',
            path: '/int/accounting/statistics',
            component: './onnet-portal/lb/statistics',
          },
        ],
      },
      {
        path: '/int/telephony',
        name: 'telephony',
        icon: 'phone',
        authority: ['telephony'],
        routes: [
          {
            name: 'settings',
            path: '/int/telephony/admin-settings',
            component: './onnet-portal/telephony/pages/admin-settings',
            authority: ['telephony'],
          },
          {
            name: 'callflow-builder',
            path: '/int/telephony/callflow-builder',
            component: './onnet-portal/telephony/pages/callflow-builder',
            authority: ['telephony'],
          },
        ],
      },
    ],
  },
  {
    component: './onnet-portal/404',
  },
];
