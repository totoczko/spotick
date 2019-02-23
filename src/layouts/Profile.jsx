import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import red from '@material-ui/core/colors/red';
import { Typography, CircularProgress, GridListTile, GridList } from '@material-ui/core';
import BottomAppNavigation from 'components/BottomAppNavigation';
import Navigation from 'components/Navigation';
import UserPostContainer from '../containers/UserPostContainer';

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
		lineHeight: '1em',
		color: '#999',
		marginBottom: 5,
		marginTop: 15
	},
	counter: {
		lineHeight: '1em',
		marginBottom: 15
	},
	gridList: {
		margin: '0 !important'
	},
	postCounter: {
		border: '1px solid #eee',
		textAlign: 'center'
	},
	center: {
		width: '100%',
		height: '100vh',
		position: 'absolute',
		left: 0,
		top: 0,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	}
});

class Profile extends PureComponent {

	renderPostsCounter(count) {
		const { classes } = this.props;
		return (
			<div className={classes.postCounter}>
				<Typography variant="overline" className={classes.heading}>Moje posty</Typography>
				<Typography variant="overline" className={classes.counter}>{count}</Typography>
			</div>
		)
	}

	render() {
		const { classes } = this.props;
		const user = JSON.parse(localStorage.getItem('user_data'));
		return (
			<>
				<Navigation />
				<Card className={classes.profile}>
					<CardHeader
						avatar={
							<Avatar className={classes.avatar}>{user.displayName ? user.displayName[0].toUpperCase() : ''}</Avatar>
						}
						title={user ? user.displayName : ''}
						subheader={user ? user.email : ''}
					/>
				</Card>
				<UserPostContainer>
					{(posts, status) => {
						if (status === 'loading') {
							return (
								<>
									{this.renderPostsCounter(0)}
									<div className={classes.center}>
										<CircularProgress className={classes.progress} size={30} thickness={5} />
									</div>
								</>
							)
						}
						return (
							<>
								{this.renderPostsCounter(posts.length)}
								<GridList container spacing={0} className={classes.gridList}>
									{posts.length > 0 ?
										posts.map((post, index) => (
											<GridListTile cols={1} key={index} className={classes.gridListTile}>
												<img src={post.img} alt={post.shortText} />
											</GridListTile>
										)) : (
											<Typography variant="subheading" className={classes.center}>
												Brak postów do wyświetlenia
                   </Typography>
										)}
								</GridList>
							</>
						)
					}
					}
				</UserPostContainer>
				<BottomAppNavigation />
			</>
		)
	}
}

Profile.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);