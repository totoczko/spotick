import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SettingsIcon from '@material-ui/icons/Settings';
import classnames from 'classnames';
import logo from '../assets/images/logo-nb.png';

const styles = {
	root: {
		flexGrow: 1
	},
	appbar: {
		backgroundColor: '#CFDEF5'
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
		color: '#212985'
	},
	lefticon: {
		marginRight: 30
	}
};

function Navigation(props) {
	const { classes, location, handleSwitch, imgSent, step } = props;
	return (
		<div className={classes.root}>
			<AppBar
				position="fixed"
				className={classes.appbar}
			>
				<Toolbar>
					<Typography
						variant="h6"
						color="inherit"
						className={classes.grow}
					>
						<Link
							to="/"
							className={classes.logo}
						>
							<img src={logo} alt="" className={classes.logoimage} />
						</Link>
					</Typography>
					{location.pathname === '/add' && imgSent && step !== 3
						&&
						<Button
							className={classes.link}
							onClick={handleSwitch(3)}
						>
							Krok 2
						</Button>
					}
					{location.pathname === '/add' && imgSent && step === 3
						&&
						<Button
							className={classes.link}
							onClick={handleSwitch(1)}
						>
							Wróć
						</Button>
					}
					{location.pathname === '/profile' &&
						<>
							<Link to="/upvotes" >
								<FavoriteIcon className={classnames(classes.link, classes.lefticon)} />
							</Link>
							<Link to="/settings" >
								<SettingsIcon className={classes.link} />
							</Link>
						</>
					}
				</Toolbar>
			</AppBar>
		</div>
	);
}

Navigation.propTypes = {
	classes: PropTypes.object,
	location: PropTypes.object,
	handleSwitch: PropTypes.func,
	imgSent: PropTypes.bool,
	step: PropTypes.number
};

const navigationWithRouter = withRouter(Navigation);

export default withStyles(styles)(navigationWithRouter);
