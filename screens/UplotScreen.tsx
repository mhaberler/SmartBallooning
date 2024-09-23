import React from 'react';
import { WebView } from 'react-native-webview';

import { uPlot } from 'uplot';

const UPlotExample = () => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>uPlot Example</title>
        <script src="https://cdn.jsdelivr.net/npm/uplot/dist/uPlot.min.js"></script>
    </head>
    <body>
        <div id="chart" style="width:100%; height:300px;"></div>
        <script>
            const data = [
                [0, 1, 2, 3, 4, 5],
                [12, 22, 5, 17, 6, 21]
            ];
            const opts = {
                title: 'Simple Plot',
                series: [{ label: 'Time' }, { label: 'Values' }]
            };
            const u = new uPlot(opts, data, document.getElementById('chart'));
        </script>
    </body>
    </html>
  `;
  const htmlContent2 = `
    <html>
      <body>
        <h1>Hello from WebView!</h1>
        <p>This is some HTML content displayed inside a React Native WebView.</p>
      </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      style={{ marginTop: 120 }}
    />
  );
};

export default UPlotExample;