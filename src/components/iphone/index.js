// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';
import Favourite from '../Favourite';

export default class Iphone extends Component {

	constructor(props){
		super(props);
		this.state = {
			location: {
				city: 'London',
				country: 'Uk',
			},
			favourites: [],
		};
		this.setState({ display: true });
	}

	fetchWeatherData = () => {
		var url = "http://api.wunderground.com/api/a5050eda0657b131/conditions/q/"+this.state.location.country+"/"+this.state.location.city+".json";		
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		})
		this.setState({ 
     		display: false,
    	});
	}
	parseResponse = (parsed_json) => {
		var location = parsed_json['current_observation']['display_location']['city'];
		var temp_c = parsed_json['current_observation']['temp_c'];
		var conditions = parsed_json['current_observation']['weather'];
		//var bgURL = parseConditions(conditions); //Get corresponding background image URL
		// set states for fields so they could be rendered later on
			this.setState({
				locate: location,
				temp: temp_c,
				cond : conditions,
     		   imgSrc: conditions
		});      
	}
	fetch10DayData = () => {
		//Get  10 day forecast
		var url = "http://api.wunderground.com/api/a5050eda0657b131/forecast10day/q/UK/London.json";
		$.ajax({
      url: url,
      dataType: "jsonp",
      success: this.parseResponse,
      error: function( req, err ){ console.log( 'API_CALL FAILED'+ err ) }
		})
    //this.setState({ display:false });
	}
	addToFavourite = (location) => {
		// console.log(this.location);
		if( this.state.favourites.indexOf(location) === -1){
			this.setState({
				favourites: this.state.favourites.concat( this.state.location)
			});
			console.log("GGGG");
		}
		console.log(this.state.favourites);

	}
	handleChangeFor = (propertyName) => (event) => {
		const { location } = this.state;
		const newLocation = {
			...location,
			[propertyName]: event.target.value
		};
		this.setState({ location: newLocation });
	}
	// the main render method for the iphone component
	render({}, {favourites}) {
		// check if temperature data is fetched, if so add the sign styling to the page
		// const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;
    	var imgSrc = this.state.cond ? this.state.cond : 'clear-iphone';
    	var bgpic = {
     		backgroundImage: 'url(../../assets/backgrounds/'+imgSrc+'.jpg)'
    	};
		
		// display all weather data
		return (
			<div class={ style.container } style={bgpic}> 
				<div class={ style.header }>
					<div class={ style.city }>{ this.state.locate }</div>
					<div class={ style.conditions }>{ this.state.cond }</div>
					<span class={ style.temp }>{ this.state.temp }</span>
				</div>
				<div class={ style.details }></div>
				<div class= { style_iphone.container }> 
					{ this.state.display ? 
						<Button class={ style_iphone.button } clickFunction={ this.fetchWeatherData } display="Display Weather"/ > 
					: null }
				</div>
				<div>
					<input type="text" onChange={this.handleChangeFor('city')} value={this.state.location.city} />
					<input type="text" onChange={this.handleChangeFor('country')} value={this.state.location.country} />
					<Button class={ style_iphone.button } clickFunction={() => this.addToFavourite(this.state.location) } display="Add To Favourite" />
				</div>
				<Favourite favourite={this.favourite} />
			</div>
		);
	}
}
