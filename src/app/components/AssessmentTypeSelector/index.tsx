import * as React from 'react';
import { Card, Button, Icon } from 'semantic-ui-react';
import {AssessmentType, defaultRemoteMeetingLimit} from 'models/assessment';
const ReactGA = require('react-ga');
import './style.less';

interface IProps  {
  typeSelector: (selected: AssessmentType) => void;
}

class AssessmentTypeSelector extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.typeClickFn = this.typeClickFn.bind(this);
  }

  private typeClickFn(t: AssessmentType): () => void {
    return () => {
      ReactGA.event({
        category: 'assessment',
        action: 'typeSelected',
        label: AssessmentType[t],
      });
      this.props.typeSelector(t);
    };
  }

  public render() {
    return (
      <Card.Group>
        <Card>
          <div className="type-pic first">
            <Icon name="comments outline" size="big" />
            <h2 className="white">Live</h2>
          </div>
          <Card.Content>
            <Card.Header>
              Complete together
            </Card.Header>
            <Card.Description>
              Complete the questionnaire together
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Button primary onClick={this.typeClickFn(AssessmentType.live)}>Select</Button>
          </Card.Content>
        </Card>
        <Card>
          <div className="type-pic second">
            <Icon name="linkify" size="big" />
            <h2 className="white">Remote</h2>
          </div>
          <Card.Content>
            <Card.Header>
              Send a link
            </Card.Header>
            <Card.Description>
              Generates a link that you can send to the beneficiary to complete on their own. The link will be valid for {defaultRemoteMeetingLimit} days
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Button primary onClick={this.typeClickFn(AssessmentType.remote)}>Select</Button>
          </Card.Content>
        </Card>
        <Card>
          <div className="type-pic third">
            <Icon name="file text outline" size="big" />
            <h2 className="white">Data Entry</h2>
          </div>
          <Card.Content>
            <Card.Header>
              Enter historic data
            </Card.Header>
            <Card.Description>
              Enter data gathered historically into the system. For example, if you completed the questionnaire on paper with the beneficiary
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Button primary onClick={this.typeClickFn(AssessmentType.historic)}>Select</Button>
          </Card.Content>
        </Card>
      </Card.Group>
    );
  }
}

export { AssessmentTypeSelector }
