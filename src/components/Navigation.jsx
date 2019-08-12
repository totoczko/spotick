import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Button } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import MoreVertIcon from '@material-ui/icons/MoreVert';
// import SearchIcon from '@material-ui/icons/Search';
import logo from 'assets/images/logo-nb.png';
import { colors } from '../helpers/colors';
// import Input from '@material-ui/core/Input';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	appbar: {
		backgroundColor: colors.background,
		boxShadow: 'none',
		borderBottom: '1px solid ' + colors.border,
	},
	grow: {
		flexGrow: 1,
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20,
	},
	logo: {
		display: 'flex',
		alignItems: 'center'
	},
	logoimage: {
		height: 40
	},
	link: {
		color: colors.primary
	},
	lefticon: {
		marginRight: 30
	},
	toolbar: {
		justifyContent: 'space-between',
		[theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
			width: 1100,
			marginLeft: 'auto',
			marginRight: 'auto',
		}
	}
	// search: {
	// 	width: 25,
	// 	transition: 'width 100ms ease-in-out'
	// },
	// searchActive: {
	// 	width: 200,
	// 	transition: 'width 100ms ease-in-out'
	// }
});

class Navigation extends React.Component {
	// constructor(props) {
	// 	super(props);

	// this.state = {
	// 	searchActive: false
	// }
	// }

	goBack = () => {
		this.props.history.goBack();
	}

	// openSearch = () => {
	// 	this.setState({
	// 		searchActive: true
	// 	})
	// }

	render() {
		const { classes, location, handleSwitch, imgSent, step, singlePost, openActions, onlyBack, loggedOut } = this.props;
		// const { searchActive } = this.state;
		return (
			<div className={classes.root}>
				<AppBar position="fixed" className={classes.appbar}>
					<Toolbar className={classes.toolbar}>
						{!singlePost && !onlyBack &&
							<Link to="/" className={classes.logo}>
								<img src={logo} alt="" className={classes.logoimage} />
							</Link>
						}
						{(singlePost || onlyBack) && !loggedOut &&
							<ArrowBackIosIcon className={classes.link} onClick={this.goBack} />
						}
						{location.pathname === '/add' && imgSent && step === 3 && !loggedOut &&
							<Button className={classes.link} onClick={handleSwitch(1)}>
								Wróć
						</Button>
						}
						{location.pathname === '/profile' && !loggedOut &&
							<Link to="/settings" >
								<SettingsIcon className={classes.link} />
							</Link>
						}
						{singlePost && openActions && !loggedOut &&
							<MoreVertIcon className={classes.link} onClick={openActions} />
						}
						{/* {location.pathname === '/' &&
							<FormControl className={classes.margin}>
								<Input
									id="input-with-icon-adornment"
									className={searchActive ? classes.searchActive : classes.search}
									startAdornment={
										<InputAdornment position="start">
											<SearchIcon className={classes.link} onClick={this.openSearch} />
										</InputAdornment>
									}
								/>
							</FormControl>
						} */}
					</Toolbar>
				</AppBar>
			</div>
		);
	}
}

Navigation.propTypes = {
	classes: PropTypes.object,
	location: PropTypes.object,
	handleSwitch: PropTypes.func,
	imgSent: PropTypes.bool,
	step: PropTypes.number,
	singlePost: PropTypes.bool,
	openActions: PropTypes.func,
	onlyBack: PropTypes.bool
};

const navigationWithRouter = withRouter(Navigation);

export default withStyles(styles)(navigationWithRouter);
