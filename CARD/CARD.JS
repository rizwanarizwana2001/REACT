const Card = ({ src, description, title }) => {
  return (
    <div className="card1">
      <div className="imgg">
        <img src={src} alt={title} />
      </div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
};

export default Card;
