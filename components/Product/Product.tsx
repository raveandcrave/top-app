import {ForwardedRef, forwardRef, useRef, useState} from 'react';
import Image from 'next/image';
import cn from 'classnames';
import {motion} from 'framer-motion';
import {ProductProps} from './Product.props';
import styles from './Product.module.css';
import Card from '../Card/Card';
import Rating from '../Rating/Rating';
import Tag from '../Tag/Tag';
import Button from '../Button/Button';
import {declOfNum, priceRu} from '@/helpers/helpers';
import Divider from '../Divider/Divider';
import Review from '../Review/Review';
import ReviewForm from '../ReviewForm/ReviewForm';

const Product = motion(
  // eslint-disable-next-line react/display-name
  forwardRef(({product, className, ...props}: ProductProps, ref: ForwardedRef<HTMLDivElement>) => {
    const [isReviewOpened, setIsReviewOpened] = useState<boolean>(false);

    const reviewRef = useRef<HTMLDivElement>(null);

    const scrollToReview = () => {
      setIsReviewOpened(true);
      reviewRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    };

    return (
      <div className={className} ref={ref} {...props}>
        <Card className={styles.product}>
          <div className={styles.logo}>
            <Image src={process.env.NEXT_PUBLIC_DOMAIN + product.image} alt={product.title} width={70} height={70} />
          </div>
          <div className={styles.title}>{product.title}</div>
          <div className={styles.price}>
            {priceRu(product.price)}
            {product.oldPrice && (
              <Tag className={styles.oldPrice} size="small" color="green">
                {priceRu(product.price - product.oldPrice)}
              </Tag>
            )}
          </div>
          <div className={styles.credit}>
            {priceRu(product.credit)}/<span className={styles.month}>мес</span>
          </div>
          <div className={styles.rating}>
            <Rating rating={product.reviewAvg ?? product.initialRating} />
          </div>
          <div className={styles.tags}>
            {product.categories.map((category) => (
              <Tag className={styles.category} key={category} color="ghost">
                {category}
              </Tag>
            ))}
          </div>
          <div className={styles.priceTitle}>цена</div>
          <div className={styles.creditTitle}>кредит</div>
          <div className={styles.rateTitle}>
            <a href="#ref" onClick={scrollToReview}>
              {product.reviewCount} {declOfNum(product.reviewCount, ['отзыв', 'отзыва', 'отзывов'])}
            </a>
          </div>
          <Divider className={styles.hr} />
          <div className={styles.description}>{product.description}</div>
          <div className={styles.feature}>
            {product.characteristics.map((item) => (
              <div className={styles.characteristic} key={item.name}>
                <span className={styles.characteristicName}>{item.name}</span>
                <span className={styles.characteristicDots}></span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
          <div className={styles.advBlock}>
            {product.advantages && (
              <div className={styles.advantages}>
                <div className={styles.advTitle}>Преимущества</div>
                <div>{product.advantages}</div>
              </div>
            )}
            {product.disadvantages && (
              <div className={styles.disadvantages}>
                <div className={styles.advTitle}>Недостатки</div>
                <div>{product.disadvantages}</div>
              </div>
            )}
          </div>
          <Divider className={cn(styles.hr, styles.hr2)} />

          <div className={styles.actions}>
            <Button appearance="primary">Узнать подробнее</Button>
            <Button
              className={styles.reviewButton}
              appearance="ghost"
              arrow={isReviewOpened ? 'down' : 'right'}
              onClick={() => setIsReviewOpened(!isReviewOpened)}>
              Читать отзывы
            </Button>
          </div>
        </Card>
        <Card
          ref={reviewRef}
          color="blue"
          className={cn({
            [styles.opened]: isReviewOpened,
            [styles.closed]: !isReviewOpened,
          })}>
          {product.reviews.map((item) => (
            <div key={item._id}>
              <Review review={item} />
              <Divider />
            </div>
          ))}

          <ReviewForm productId={product._id} />
        </Card>
      </div>
    );
  })
);

// Product.displayName = 'Product';

export default Product;
