function Legend() {
    return (
      <div className="legend-box">
        <div className="legend-item">
          <b>Тип студии</b>
        </div>
        <div className="legend-item">
          <span className="legend-color undergraduate"></span> Додипломски
        </div>
        <div className="legend-item">
          <span className="legend-color masters"></span> Магистерски
        </div>
        <div className="legend-item">
          <span className="legend-color phd"></span> Докторски
        </div>
      </div>
    );
  }

export default Legend;