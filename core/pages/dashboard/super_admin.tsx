/* eslint-disable func-names */

import React, { useEffect } from 'react';
import Raphael from 'raphael';
import { connect } from 'dva';
import { Redirect, history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const myGraph = (system_status, kz_registrations_count) =>
  system_status.data
    ? Object.keys(system_status.data).map(zone => {
        if (system_status.data[zone].kamailio) {
          const regs = Object.values(system_status.data[zone].kamailio).reduce(
            (acc, val) => acc + val.roles.Registrar.Registrations,
            0,
          );

          const cluster_regs = kz_registrations_count.data ? kz_registrations_count.data.count : 0;
          let value = 0;
          let label_value = 0;

          if (cluster_regs < 10) {
            value = 10;
          } else if (regs > cluster_regs / 10) {
            value = regs;
          } else {
            value = Math.floor(cluster_regs / 10);
          }
          if (regs > cluster_regs) {
            label_value = cluster_regs;
          } else {
            label_value = regs;
          }

          return { label: zone, label_value, value };
        }
        return { label: zone, label_value: 0, value: 0 };
      })
    : [];

const SuperDuperDashboard = props => {
  const {
    dispatch,
    kz_login = {},
    kz_account = {},
    kz_registrations_count = {},
    kz_system_status = {},
  } = props;

  useEffect(() => {
    if (
      kz_system_status.data &&
      Object.keys(kz_system_status.data).length > 1 &&
      kz_registrations_count.data
    ) {
      // eslint-disable-next-line no-undef
      Raphael.fn.pieChart = function(cx, cy, r, values, stroke, total_reg_count) {
        const paper = this;
        const rad = Math.PI / 180;

        function sector(sector_fn_cx, sector_fn_cy, sector_fn_r, startAngle, endAngle, params) {
          const x1 = sector_fn_cx + sector_fn_r * Math.cos(-startAngle * rad);
          const x2 = sector_fn_cx + sector_fn_r * Math.cos(-endAngle * rad);
          const y1 = sector_fn_cy + sector_fn_r * Math.sin(-startAngle * rad);
          const y2 = sector_fn_cy + sector_fn_r * Math.sin(-endAngle * rad);
          return paper
            .path([
              'M',
              sector_fn_cx,
              sector_fn_cy,
              'L',
              x1,
              y1,
              'A',
              sector_fn_r,
              sector_fn_r,
              0,
              +(endAngle - startAngle > 180),
              0,
              x2,
              y2,
              'z',
            ])
            .attr(params);
        }

        let angle = 0;
        let total = 0;
        const process = function(j) {
          const { value } = values[j];
          const angleplus = (360 * value) / total;
          const popangle = angle + angleplus / 2;
          const ms = 500;
          const delta = 30;
          const bcolor = `#${Math.floor(Math.random() * 0x1000000)
            .toString(16)
            .padStart(6, 0)}`;
          const p = sector(cx, cy, r, angle, angle + angleplus, {
            'custom-attr': j,
            cursor: 'pointer',
            fill: bcolor,
            stroke,
            'stroke-width': 3,
          });
          p.mouseover(function() {
            p.stop().animate({ transform: `s1.1 1.1 ${cx} ${cy}` }, ms, 'elastic');
          }).mouseout(function() {
            p.stop().animate({ transform: '' }, ms, 'elastic');
          });
          p.click(function() {
            console.log(`/dashboard/${values[j].label}`);
            history.push({ pathname: '/int/zone', state: { zone: values[j].label } });
          });
          paper
            .text(
              cx + (r + delta + 50) * Math.cos(-popangle * rad),
              cy + (r + delta + 20) * Math.sin(-popangle * rad),
              values[j].label,
            )
            .attr({
              fill: bcolor,
              stroke: 'none',
              opacity: 1,
              cursor: 'pointer',
              'font-size': 20,
            })
            .click(function() {
              history.push({ pathname: '/int/zone', state: { zone: values[j].label } });
            });
          paper
            .text(
              cx + (r / 2 + delta) * Math.cos(-popangle * rad),
              cy + (r / 2 + delta) * Math.sin(-popangle * rad),
              values[j].label_value,
            )
            .attr({
              fill: '#fff',
              stroke: 'none',
              opacity: 1,
              cursor: 'pointer',
              'font-size': 20,
            })
            .click(function() {
              history.push({ pathname: '/int/zone', state: { zone: values[j].label } });
            });
          angle += angleplus;
        };
        let i = 0;
        const ii = values.length;
        for (i = 0; i < ii; i += 1) {
          total += values[i].value;
        }

        for (i = 0; i < ii; i += 1) {
          process(i);
        }

        paper
          .circle(cx, cy, r / 3)
          .attr({ fill: '#fff', stroke: '#fff', cursor: 'pointer' })
          .click(function() {
            history.push(`/int/reseller_portal/monitor/sip_registrations`);
          });
        paper
          .text(cx, cy, `Registrations\n${total_reg_count}`)
          .attr({ 'font-size': '14', cursor: 'pointer' })
          .click(function() {
            history.push(`/int/reseller_portal/monitor/sip_registrations`);
          });
      };
      document.getElementById('registrations_pie_div').innerHTML = '';
      const total_reg_count = kz_registrations_count.data ? kz_registrations_count.data.count : 0;
      // eslint-disable-next-line no-undef
      Raphael('registrations_pie_div', 800, 600).pieChart(
        400,
        300,
        250,
        myGraph(kz_system_status, kz_registrations_count),
        '#fff',
        total_reg_count,
      );
    } else {
      // eslint-disable-next-line no-undef
      if (kz_account.data.superduper_admin && !kz_system_status.data) {
        dispatch({
          type: 'kz_system_status/refresh',
          payload: { account_id: kz_login.data.account_id },
        });
      }
      if (!kz_registrations_count.data) {
        dispatch({
          type: 'kz_registrations_count/refresh',
          payload: { account_id: kz_login.data.account_id },
        });
      }
    }
  }, [kz_login, kz_account, kz_registrations_count, kz_system_status]);

  return (
    <PageHeaderWrapper>
      {kz_system_status.data ? (
        Object.keys(kz_system_status.data).length === 1 ? (
          <Redirect
            to={{
              pathname: '/int/zone',
              state: { zone: Object.keys(kz_system_status.data)[0] },
            }}
          />
        ) : (
          <div id="registrations_pie_div" />
        )
      ) : (
        <div id="registrations_pie_div" />
      )}
    </PageHeaderWrapper>
  );
};

export default connect(({ kz_login, kz_account, kz_system_status, kz_registrations_count }) => ({
  kz_login,
  kz_account,
  kz_system_status,
  kz_registrations_count,
}))(SuperDuperDashboard);
