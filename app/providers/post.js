import React, { Component } from 'react'
import MobileDetect from 'mobile-detect'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

// import the root view that this provider is connected to
import PostView from './../views/post'

// grab any actions we need to perform
import { getPosts } from './../reducer/ducks/post'

// import any services we might need
import * as api from './../services/api'

// pull any application data from redux needed for view
function mapStateToProps (state) {
  return {
    ...state.post,
    video: state.video,
  }
}

class PostProvider extends Component {
  constructor (): void {
    super(...arguments)

    // Detect if we're on mobile so we can automuted videos to autoplay
    const md = new MobileDetect(window.navigator.userAgent)
    this.isMobile = (md.mobile() !== null || md.tablet() !== null)

    // Bind functions
    this.onLoadMore = this.onLoadMore.bind(this)
    this.onNavigate = this.onNavigate.bind(this)
  }

  componentDidMount () {
    const { params } = this.props

    if (params && params.q) {
      console.log('params', params)
      this.onSearch(params.q)
    } else {
      // Load global posts
      this.onLoadMore()
    }
  }

  render (): React.Element<any> {
    const props = {
      ...this.props,
      onLoadMore: this.onLoadMore,
      onStartVideo: this.onStartVideo,
      onStopVideo: this.onStopVideo,
      onSearch: this.onSearch,
      onNavigate: this.onNavigate,
    }

    return <PostView {...props} />
  }

  onLoadMore (): void {
    const { dispatch, lastId, query } = this.props
    console.log('loading more | query | lastId', query, lastId)
    if (query !== '') {
      dispatch(search(query, lastId, api))
    } else {
      dispatch(getPosts(lastId, api))
    }
  }

  onNavigate (path) {
    const { dispatch } = this.props

    dispatch(clearSearch())
    dispatch(getPosts('0', api))
    dispatch(push(path))
  }
}

export default connect(mapStateToProps)(PostProvider)
