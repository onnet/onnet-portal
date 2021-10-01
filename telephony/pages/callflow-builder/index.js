import React, { useState, useEffect, Fragment } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { connect } from 'umi';
import { Tag } from 'antd';
import {
  AccountCallflows,
  AccountCallflow,
} from '@/pages/onnet-portal/telephony/services/kazoo-telephony';

import { PageHeaderWrapper } from '@ant-design/pro-layout';

const CallflowBuilder = (props) => {
  const { kz_account } = props;

  const [dataCallFlows, setDataCallFlows] = useState([]);
  const [selectedCF, setSelectedCF] = useState({});

  useEffect(() => {
    if (kz_account.data) {
      setDataCallFlows([]);
      AccountCallflows({
        account_id: kz_account.data?.id,
        method: 'GET',
      })
        .then((resp) => {
          console.log('AccountCallflows resp: ', resp);
          setDataCallFlows(resp.data);
        })
        .catch(() => console.log('Oops errors!'));
      setSelectedCF({});
      AccountCallflow({
        account_id: kz_account.data?.id,
        callflow_id: '2e8d1ae6bfcd96b90f954fd2ed82d345',
        method: 'GET',
      })
        .then((resp) => {
          console.log('AccountCallflow resp: ', resp);
          setSelectedCF(resp.data);
          drawTree(resp.data);
        })
        .catch(() => console.log('Oops errors!'));
    }
  }, [kz_account]);

  const margin = { top: 20, right: 90, bottom: 30, left: 90 };
    const width = 660 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

  // declares a tree layout and assigns the size
  const treemap = d3.tree().size([height, width]);

  function drawTree(cF) {
    console.log('Insde drawTree cF: ', cF);
    let nodes = d3.hierarchy(cF, function (d) {
      if (d.flow) {
        console.log('Inside flow nodes calc d: ', d);
        //    return Object.values(d?.flow.children);
        const cf_children = Object.keys(d.flow.children).map(function (key) {
          d.flow.children[key].cf_path = 'flow';
          return d.flow.children[key];
        });
        console.log('Inside flow nodes calc cf_children: ', cf_children);
        return cf_children;
      } 
        console.log('Inside nodes calc d: ', d);
        console.log('Inside nodes calc Object.keys(d?.children): ', Object.keys(d?.children));
        console.log('Inside nodes calc Object.values: ', Object.values(d?.children));
        //   return d?.children;
        //   return Object.values(d?.children);
        const cf_children = Object.keys(d.children).map(function (key) {
          d.children[key].cf_path = `${d.cf_path  }.${  key}`;
          return d.children[key];
        });
        console.log('Inside nodes calc cf_children: ', cf_children);
        return cf_children;
      
    });

    nodes = treemap(nodes);

    const svg = d3
        .select('#treeWrapper')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
      const g = svg.append('g').attr('transform', `translate(${  margin.left  },${  margin.top  })`);
    const link = g
      .selectAll('.cf-link')
      .data(nodes.descendants().slice(1))
      .enter()
      .append('path')
      .attr('class', 'cf-link')
      .attr('d', function (d) {
        return (
          `M${ 
          d.y 
          },${ 
          d.x 
          }C${ 
          (d.y + d.parent.y) / 2 
          },${ 
          d.x 
          } ${ 
          (d.y + d.parent.y) / 2 
          },${ 
          d.parent.x 
          } ${ 
          d.parent.y 
          },${ 
          d.parent.x}`
        );
      });
    const node = g
      .selectAll('.cf-node')
      .data(nodes.descendants())
      .enter()
      .append('g')
      .attr('class', function (d) {
        return `cf-node${  d.children ? ' cf-node--internal' : ' cf-node--leaf'}`;
      })
      .attr('transform', function (d) {
        return `translate(${  d.y  },${  d.x  })`;
      });

    node
      .append('circle')
      .attr('r', 10)
      .on('click', function (event, d) {
        console.log('Clicked node event: ', event);
        console.log('Clicked circle d: ', d);
        console.log('Clicked circle d.data: ', d.data);
      });

    // adds the text to the node
    node
      .append('text')
      //    .data('Kirill')
      .attr('dy', '.35em')
      .attr('x', function (d) {
        return d.children ? -13 : 13;
      })
      .style('text-anchor', function (d) {
        return d.children ? 'end' : 'start';
      })
      .text(function (d) {
        console.log('name d', d);
        return d.data.name ? d.data.name : d.data.module;
      })
      //      .dataset.my_test(function (d) {
      //              console.log("dataset d", d);
      //        return d.data.name ? d.data.name : d.data.module;
      //      })
      .on('click', function (event, d) {
        console.log('Clicked node nodes.ancestors(): ', nodes.ancestors());
        console.log('Clicked node event: ', event);
        console.log('Clicked node d: ', d);
        console.log('Clicked node d.data: ', d.data);
      });
  }

  return (
    <PageHeaderWrapper breadcrumb={false}>
      <div id="treeWrapper"></div>
    </PageHeaderWrapper>
  );
};

export default connect(({ kz_account }) => ({
  kz_account,
}))(CallflowBuilder);
