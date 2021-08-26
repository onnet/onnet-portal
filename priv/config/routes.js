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
    component: '@/pages/onnet-portal/core/layouts/BasicLayout',
    Routes: ['@/pages/onnet-portal/core/layouts/Authorized'],
    authority: ['admin', 'consumer', 'reseller'],
    routes: [
      {
        name: 'dashboard',
        path: '/int/dashboard',
        component: './onnet-portal/core/pages/dashboard',
        icon: 'dashboard',
        authority: ['!superduper_admin', '!reseller', 'consumer'],
      },
      { path: '/int/zone', component: './onnet-portal/core/pages/dashboard/zone_info' },
      {
        name: 'accounts',
        path: '/int/accounts',
        component: './onnet-portal/reseller/portal',
        authority: ['reseller', '!child_account_selected'],
        icon: 'dashboard',
      },
      {
        name: 'accounts',
        path: '/int/accounts',
        authority: ['child_account_selected'],
        icon: 'dashboard',
        routes: [
          {
            name: 'account_details',
            path: '/int/accounts/account',
            component: './onnet-portal/reseller/portal',
          },
          {
            path: '/int/accounts/telephony',
            name: 'telephony',
            icon: 'phone',
            authority: ['child_telephony'],
            routes: [
              {
                name: 'settings',
                path: '/int/accounts/telephony/admin-settings',
                component: './onnet-portal/telephony/pages/admin-settings',
                authority: ['child_telephony'],
              },
              {
                name: 'statistics',
                path: '/int/accounts/telephony/statistics',
                component: './onnet-portal/telephony/pages/statistics',
                authority: ['child_telephony'],
              },
              {
                name: 'current_calls',
                path: '/int/accounts/telephony/calls',
                component: './onnet-portal/telephony/pages/current_calls',
              },
              {
                name: 'current_sip_registrations',
                path: '/int/accounts/telephony/sip_registrations',
                component: './onnet-portal/telephony/pages/current_registrations',
              },
            ],
          },
        ],
      },
      {
        name: 'reseller_portal',
        path: '/int/reseller_portal',
        icon: 'account-book',
        authority: ['superduper_admin', 'reseller', '!child_account_selected'],
        routes: [
          {
            name: 'reseller_settings',
            path: '/int/reseller_portal/settings',
            component: './onnet-portal/reseller/settings',
          },
          {
            path: '/int/reseller_portal/telephony',
            name: 'telephony',
            icon: 'phone',
            //          authority: ['telephony'],
            routes: [
              {
                name: 'settings',
                path: '/int/reseller_portal/telephony/admin-settings',
                component: './onnet-portal/telephony/pages/admin-settings',
                //             authority: ['child_telephony'],
              },
              {
                name: 'current_calls',
                path: '/int/reseller_portal/telephony/calls',
                component: './onnet-portal/telephony/pages/current_calls',
              },
              {
                name: 'current_sip_registrations',
                path: '/int/reseller_portal/telephony/sip_registrations',
                component: './onnet-portal/telephony/pages/current_registrations',
              },
            ],
          },
          {
            name: 'monitor',
            path: '/int/reseller_portal/monitor', // icon: 'user',
            authority: ['superduper_admin'],
            routes: [
              {
                name: 'cluster',
                path: '/int/reseller_portal/monitor/cluster',
                component: './onnet-portal/core/pages/dashboard/zone_info',
              },
              {
                name: 'amqp_messages',
                path: '/int/reseller_portal/monitor/amqp',
                component: './onnet-portal/reseller/monitor/amqp_messages',
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
            name: 'devices',
            path: '/int/telephony/devices',
            component: './onnet-portal/telephony/pages/devices',
            authority: ['telephony'],
          },
          {
            name: 'callflow-builder',
            path: '/int/telephony/callflow-builder',
            component: './onnet-portal/telephony/pages/callflow-builder',
            authority: ['telephony'],
          },
          {
            name: 'statistics',
            path: '/int/telephony/statistics',
            component: './onnet-portal/telephony/pages/statistics',
            authority: ['telephony'],
          },
          {
            name: 'current_calls',
            path: '/int/telephony/calls',
            component: './onnet-portal/telephony/pages/current_calls',
            authority: ['telephony'],
          },
          {
            name: 'current_sip_registrations',
            path: '/int/telephony/sip_registrations',
            component: './onnet-portal/telephony/pages/current_registrations',
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
