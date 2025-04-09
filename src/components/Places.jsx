export default function Places({ title, isLoading, isLoadingText, places, fallbackText, onSelectPlace }) {
  return (
    <section className='places-category'>
      <h2>{title}</h2>
      {isLoading && <p className='fallback-text'>{isLoadingText}</p>}
      {!isLoading && places.length === 0 && <p className='fallback-text'>{fallbackText}</p>}
      {!isLoading && places.length > 0 && (
        <ul className='places'>
          {places.map((place) => (
            <li
              key={place.id}
              className='place-item'>
              <button onClick={() => onSelectPlace(place)}>
                <img
                  //Comment this line if running with backend
                  src={place.image.src}
                  //Uncomment this line if running with backend
                  // src={`http://localhost:3000/${place.image.src}`}
                  alt={place.image.alt}
                />
                <h3>{place.title}</h3>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
