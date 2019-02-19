import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { auth } from '../helpers/firebase.js'
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import red from '@material-ui/core/colors/red';
import { Typography } from '@material-ui/core';
import BottomAppNavigation from '../components/BottomAppNavigation';
import Navigation from '../components/Navigation';

const styles = theme => ({
	profile: {
		maxWidth: 400,
		borderRadius: 0,
		boxShadow: 'none',
		marginTop: 60
	},
	avatar: {
		backgroundColor: red[500],
	},
	heading: {
		padding: 16,
		marginLeft: 16
	}
});

class Profile extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			user: null
		}
	}

	componentDidMount() {
		auth.onAuthStateChanged((user) => {
			if (user) {
				this.setState({
					user
				})
			}
		});
	}

	render() {
		const { classes } = this.props;
		const { user } = this.state;
		return (
			<>
				<Navigation />
				<Card className={classes.profile}>
					<CardHeader
						avatar={
							<Avatar className={classes.avatar}>{user ? user.displayName[0].toUpperCase() : ''}</Avatar>
						}
						title={user ? user.displayName : ''}
						subheader={user ? user.email : ''}
					/>
				</Card>
				<Typography variant="overline" gutterBottom className={classes.heading}>
					Moje posty
      	</Typography>
				<BottomAppNavigation />
			</>
		)
	}
}



Profile.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);