import React from "react";

const Map: React.FC = () => {
  return (
    <div id="map-area">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.7160193413333!2d105.84053297749585!3d21.004017638731025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac7693a06c5b%3A0xdba5d46e9cf25910!2zMTAxIFAuIFRy4bqnbiDEkOG6oWkgTmdoxKlhLCBCw6FjaCBLaG9hLCBIYWkgQsOgIFRyxrBuZywgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1734269808169!5m2!1svi!2s"
        width="100%"
        height="450"
        style={{ border: 0 }}
        loading="lazy"
        title="This is a unique title"
      ></iframe>
    </div>
  );
};

export default Map;
